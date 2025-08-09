const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Form = require('../models/Form');

// GET /api/responses - Get all responses
router.get('/', async (req, res) => {
  try {
    const responses = await Response.find()
      .populate('formId', 'title')
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/responses/form/:formId - Get responses for a specific form
router.get('/form/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId })
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/responses/:id - Get response by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await Response.findById(req.params.id)
      .populate('formId');
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/responses - Create new response
router.post('/', async (req, res) => {
  try {
    const { formId, answers, respondentEmail, respondentName } = req.body;
    
    // Verify form exists and is published
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    if (form.status !== 'published') {
      return res.status(403).json({ error: 'Form is not published' });
    }

    // Calculate scores for each answer
    const processedAnswers = await calculateScores(answers, form);
    
    const response = new Response({
      formId,
      respondentEmail,
      respondentName,
      answers: processedAnswers,
      submittedAt: Date.now(),
      isCompleted: true,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/responses/:id - Update response
router.put('/:id', async (req, res) => {
  try {
    const response = await Response.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/responses/:id - Delete response
router.delete('/:id', async (req, res) => {
  try {
    const response = await Response.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/responses/form/:formId/analytics - Get analytics for a form
router.get('/form/:formId/analytics', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    
    if (responses.length === 0) {
      return res.json({
        totalResponses: 0,
        averageScore: 0,
        completionRate: 0,
        averageTime: 0
      });
    }

    const totalResponses = responses.length;
    const completedResponses = responses.filter(r => r.isCompleted);
    const averageScore = responses.reduce((sum, r) => sum + r.totalScore, 0) / totalResponses;
    const completionRate = (completedResponses.length / totalResponses) * 100;
    const averageTime = responses
      .filter(r => r.completionTime)
      .reduce((sum, r) => sum + r.completionTime, 0) / responses.length;

    res.json({
      totalResponses,
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
      averageTime: Math.round(averageTime)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate scores
async function calculateScores(answers, form) {
  const processedAnswers = [];

  for (const answer of answers) {
    const question = form.questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    let processedAnswer = { ...answer };

    switch (question.type) {
      case 'categorize':
        // Score categorization (can be customized based on requirements)
        processedAnswer.score = calculateCategorizeScore(answer, question);
        break;
        
      case 'cloze':
        // Score cloze answers
        processedAnswer.score = calculateClozeScore(answer, question);
        break;
        
      case 'comprehension':
        // Score comprehension sub-questions
        processedAnswer.score = calculateComprehensionScore(answer, question);
        break;
    }

    processedAnswers.push(processedAnswer);
  }

  return processedAnswers;
}

function calculateCategorizeScore(answer, question) {
  // Simple scoring: 1 point for each correctly categorized item
  let score = 0;
  // Implementation depends on your categorization logic
  return score;
}

function calculateClozeScore(answer, question) {
  let score = 0;
  if (answer.blanks && question.blanks) {
    answer.blanks.forEach(blank => {
      const correctBlank = question.blanks.find(b => b.id === blank.blankId);
      if (correctBlank && correctBlank.answer.toLowerCase() === blank.answer.toLowerCase()) {
        score += 1;
      }
    });
  }
  return score;
}

function calculateComprehensionScore(answer, question) {
  let totalScore = 0;
  if (answer.subAnswers && question.subQuestions) {
    answer.subAnswers.forEach(subAnswer => {
      const subQuestion = question.subQuestions.find(sq => sq.id === subAnswer.subQuestionId);
      if (subQuestion) {
        let points = 0;
        if (subQuestion.correctAnswer && 
            subAnswer.answer.toLowerCase() === subQuestion.correctAnswer.toLowerCase()) {
          points = subQuestion.points || 1;
        }
        subAnswer.points = points;
        subAnswer.isCorrect = points > 0;
        totalScore += points;
      }
    });
  }
  return totalScore;
}

module.exports = router;