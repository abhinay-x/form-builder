const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true,
    enum: ['categorize', 'cloze', 'comprehension']
  },
  
  // For Categorize questions
  categorization: [{
    categoryId: String,
    itemIds: [String]
  }],
  
  // For Cloze questions
  blanks: [{
    blankId: String,
    answer: String
  }],
  
  // For Comprehension questions
  subAnswers: [{
    subQuestionId: String,
    answer: String,
    isCorrect: Boolean,
    points: Number
  }],
  
  // Common fields
  timeSpent: Number, // in seconds
  isCorrect: Boolean,
  score: Number
});

const ResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  respondentEmail: String,
  respondentName: String,
  answers: [AnswerSchema],
  totalScore: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 0
  },
  completionTime: Number, // in seconds
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  isCompleted: {
    type: Boolean,
    default: false
  }
});

// Calculate total score before saving
ResponseSchema.pre('save', function(next) {
  if (this.answers && this.answers.length > 0) {
    this.totalScore = this.answers.reduce((total, answer) => {
      if (answer.questionType === 'comprehension' && answer.subAnswers) {
        return total + answer.subAnswers.reduce((subTotal, subAnswer) => 
          subTotal + (subAnswer.points || 0), 0);
      }
      return total + (answer.score || 0);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('Response', ResponseSchema);