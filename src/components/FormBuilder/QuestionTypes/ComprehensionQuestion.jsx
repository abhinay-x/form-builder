import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, BookOpen } from 'lucide-react';

const ComprehensionQuestion = ({ question, onUpdate, isPreview, onAnswer }) => {
  const [passage, setPassage] = useState(question.passage || '');
  const [subQuestions, setSubQuestions] = useState(question.subQuestions || []);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    if (question.passage) {
      setPassage(question.passage);
    }
    if (question.subQuestions) {
      setSubQuestions(question.subQuestions);
    }
  }, [question]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handlePassageChange = (newPassage) => {
    setPassage(newPassage);
    if (!isPreview && onUpdate) {
      onUpdate(question.id, { passage: newPassage });
    }
  };

  const addSubQuestion = () => {
    const newSubQuestion = {
      id: generateId(),
      question: 'What is the main idea of this passage?',
      type: 'multiple-choice',
      options: [
        { id: generateId(), text: 'Option A', image: '' },
        { id: generateId(), text: 'Option B', image: '' }
      ],
      correctAnswer: 'Option A',
      points: 1
    };

    const newSubQuestions = [...subQuestions, newSubQuestion];
    setSubQuestions(newSubQuestions);

    if (!isPreview && onUpdate) {
      onUpdate(question.id, { subQuestions: newSubQuestions });
    }
  };

  const updateSubQuestion = (subQuestionId, updates) => {
    const newSubQuestions = subQuestions.map(sq =>
      sq.id === subQuestionId ? { ...sq, ...updates } : sq
    );

    setSubQuestions(newSubQuestions);

    if (!isPreview && onUpdate) {
      onUpdate(question.id, { subQuestions: newSubQuestions });
    }
  };

  const removeSubQuestion = (subQuestionId) => {
    const newSubQuestions = subQuestions.filter(sq => sq.id !== subQuestionId);
    setSubQuestions(newSubQuestions);

    if (!isPreview && onUpdate) {
      onUpdate(question.id, { subQuestions: newSubQuestions });
    }
  };

  const handleUserAnswerChange = (subQuestionId, answer) => {
    const newAnswers = { ...userAnswers, [subQuestionId]: answer };
    setUserAnswers(newAnswers);

    if (onAnswer) {
      onAnswer(question.id, {
        subAnswers: Object.entries(newAnswers).map(([subQuestionId, answer]) => ({
          subQuestionId,
          answer
        }))
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start">
          <BookOpen className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-purple-700">
            {onAnswer ? (
              <p>Read the passage carefully and answer the questions below.</p>
            ) : (
              <p>Add a reading passage and create questions based on it. Students will read the passage and answer your questions.</p>
            )}
          </div>
        </div>
      </div>

      {/* Passage Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Reading Passage</h4>
          {!onAnswer && !isPreview && (
            <span className="text-sm text-gray-500">
              {passage.split(/\s+/).filter(w => w.length > 0).length} words
            </span>
          )}
        </div>

        {onAnswer || isPreview ? (
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-purple-500">
            <div className="prose prose-sm max-w-none">
              {passage.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0 text-gray-800 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <textarea
              value={passage}
              onChange={(e) => handlePassageChange(e.target.value)}
              className="textarea-field min-h-[200px]"
              placeholder="Enter the reading passage here. Students will read this before answering questions."
            />
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Questions</h4>
          {!onAnswer && !isPreview && (
            <button
              onClick={addSubQuestion}
              className="btn-outline text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          )}
        </div>

        {subQuestions.length === 0 && !onAnswer && !isPreview ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No questions added yet</p>
            <p className="text-sm">Click "Add Question" to create comprehension questions</p>
          </div>
        ) : (
          <div className="space-y-6">
            {subQuestions.map((subQuestion, index) => (
              <SubQuestionComponent
                key={subQuestion.id}
                subQuestion={subQuestion}
                index={index}
                onUpdate={updateSubQuestion}
                onRemove={removeSubQuestion}
                isEditing={!onAnswer && !isPreview}
                userAnswer={userAnswers[subQuestion.id]}
                onAnswerChange={handleUserAnswerChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {!onAnswer && subQuestions.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Total questions: {subQuestions.length}</span>
            <span>
              Total points: {subQuestions.reduce((total, sq) => total + (sq.points || 1), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const SubQuestionComponent = ({ 
  subQuestion, 
  index, 
  onUpdate, 
  onRemove, 
  isEditing, 
  userAnswer, 
  onAnswerChange 
}) => {
  const addOption = () => {
    const newOption = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      text: `Option ${subQuestion.options.length + 1}`,
      image: ''
    };

    onUpdate(subQuestion.id, {
      options: [...subQuestion.options, newOption]
    });
  };

  const updateOption = (optionId, updates) => {
    const newOptions = subQuestion.options.map(opt =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );

    onUpdate(subQuestion.id, { options: newOptions });
  };

  const removeOption = (optionId) => {
    const newOptions = subQuestion.options.filter(opt => opt.id !== optionId);
    onUpdate(subQuestion.id, { options: newOptions });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-500 mr-3">
              Question {index + 1}
            </span>
            {isEditing && (
              <select
                value={subQuestion.type}
                onChange={(e) => onUpdate(subQuestion.id, { type: e.target.value })}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="short-answer">Short Answer</option>
                <option value="true-false">True/False</option>
              </select>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={subQuestion.question}
              onChange={(e) => onUpdate(subQuestion.id, { question: e.target.value })}
              className="w-full text-base font-medium bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
              placeholder="Enter your question"
              rows={2}
            />
          ) : (
            <h5 className="text-base font-medium text-gray-900 mb-3">
              {subQuestion.question}
            </h5>
          )}
        </div>

        {isEditing && (
          <div className="flex items-center space-x-2 ml-4">
            <div className="flex items-center space-x-1">
              <label className="text-xs text-gray-500">Points:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={subQuestion.points || 1}
                onChange={(e) => onUpdate(subQuestion.id, { points: parseInt(e.target.value) || 1 })}
                className="w-12 text-xs border border-gray-300 rounded px-1 py-0.5 text-center"
              />
            </div>
            <button
              onClick={() => onRemove(subQuestion.id)}
              className="text-gray-400 hover:text-red-500 p-1"
              title="Remove question"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Question Content */}
      {subQuestion.type === 'multiple-choice' && (
        <div className="space-y-3">
          {subQuestion.options.map((option, optionIndex) => (
            <div key={option.id} className="flex items-center space-x-3">
              <input
                type="radio"
                name={`question-${subQuestion.id}`}
                value={option.text}
                checked={userAnswer === option.text}
                onChange={(e) => onAnswerChange(subQuestion.id, e.target.value)}
                disabled={isEditing}
                className="text-primary-600 focus:ring-primary-500"
              />
              
              {isEditing ? (
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, { text: e.target.value })}
                    className="flex-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  <button
                    onClick={() => removeOption(option.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Remove option"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex-1 text-sm text-gray-900 cursor-pointer">
                  {option.text}
                </label>
              )}
            </div>
          ))}

          {isEditing && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={addOption}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Option
              </button>

              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-500">Correct Answer:</label>
                <select
                  value={subQuestion.correctAnswer || ''}
                  onChange={(e) => onUpdate(subQuestion.id, { correctAnswer: e.target.value })}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Select correct answer</option>
                  {subQuestion.options.map(option => (
                    <option key={option.id} value={option.text}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {subQuestion.type === 'short-answer' && (
        <div className="space-y-3">
          {isEditing ? (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sample Answer (for grading reference):</label>
              <textarea
                value={subQuestion.correctAnswer || ''}
                onChange={(e) => onUpdate(subQuestion.id, { correctAnswer: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
                placeholder="Enter a sample correct answer"
              />
            </div>
          ) : (
            <textarea
              value={userAnswer || ''}
              onChange={(e) => onAnswerChange(subQuestion.id, e.target.value)}
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Type your answer here..."
            />
          )}
        </div>
      )}

      {subQuestion.type === 'true-false' && (
        <div className="space-y-3">
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name={`question-${subQuestion.id}`}
                value="true"
                checked={userAnswer === 'true'}
                onChange={(e) => onAnswerChange(subQuestion.id, e.target.value)}
                disabled={isEditing}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm">True</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={`question-${subQuestion.id}`}
                value="false"
                checked={userAnswer === 'false'}
                onChange={(e) => onAnswerChange(subQuestion.id, e.target.value)}
                disabled={isEditing}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm">False</span>
            </label>
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2 pt-2">
              <label className="text-xs text-gray-500">Correct Answer:</label>
              <select
                value={subQuestion.correctAnswer || ''}
                onChange={(e) => onUpdate(subQuestion.id, { correctAnswer: e.target.value })}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select correct answer</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComprehensionQuestion;