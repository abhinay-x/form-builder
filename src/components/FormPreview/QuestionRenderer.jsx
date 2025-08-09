import React from 'react';
import { Image, FileText, List, Type } from 'lucide-react';

const QuestionRenderer = ({ question, preview = false }) => {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'categorize':
        return <CategorizePreview question={question} preview={preview} />;
      case 'cloze':
        return <ClozePreview question={question} preview={preview} />;
      case 'comprehension':
        return <ComprehensionPreview question={question} preview={preview} />;
      default:
        return <TextPreview question={question} preview={preview} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {question.text || 'Question text not set'}
        </h4>
        {question.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            {question.description}
          </p>
        )}
        {question.image && (
          <div className="mb-3">
            <img
              src={question.image}
              alt="Question"
              className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
      </div>

      {/* Question Content */}
      {renderQuestionContent()}
    </div>
  );
};

// Text Question Preview
const TextPreview = ({ question, preview }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <Type size={16} />
        <span>Text Response</span>
      </div>
      {preview ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-gray-500 dark:text-gray-400 italic">
            Text input field will appear here for users to enter their response
          </p>
        </div>
      ) : (
        <textarea
          placeholder="Enter your answer..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          rows={4}
          disabled
        />
      )}
    </div>
  );
};

// Categorize Question Preview
const CategorizePreview = ({ question, preview }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <List size={16} />
        <span>Categorize Items</span>
      </div>

      {/* Items to Categorize */}
      {question.items && question.items.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h6 className="font-medium text-gray-900 dark:text-white mb-3">Items to Categorize:</h6>
          <div className="flex flex-wrap gap-2">
            {question.items.map((item, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {question.categories && question.categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.categories.map((category, index) => (
            <div
              key={index}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[100px]"
            >
              <h6 className="font-medium text-gray-900 dark:text-white mb-2">{category}</h6>
              {preview && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Items will be dropped here
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {(!question.items || question.items.length === 0) && (!question.categories || question.categories.length === 0) && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <p>No items or categories configured</p>
        </div>
      )}
    </div>
  );
};

// Cloze Question Preview
const ClozePreview = ({ question, preview }) => {
  const renderTextWithBlanks = () => {
    if (!question.text) return 'Question text not set';
    
    const parts = question.text.split(/___/);
    const result = [];

    parts.forEach((part, index) => {
      result.push(
        <span key={`text-${index}`} className="text-gray-900 dark:text-white">
          {part}
        </span>
      );

      if (index < parts.length - 1) {
        result.push(
          <span
            key={`blank-${index}`}
            className="inline-block mx-1 px-3 py-1 border-b-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 min-w-[100px] text-center text-sm"
          >
            {preview ? '___' : ''}
          </span>
        );
      }
    });

    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <FileText size={16} />
        <span>Fill in the Blanks</span>
      </div>

      <div className="text-lg leading-relaxed bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        {renderTextWithBlanks()}
      </div>

      {question.options && question.options.length > 0 && (
        <div>
          <h6 className="font-medium text-gray-900 dark:text-white mb-3">Available Options:</h6>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-600"
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Comprehension Question Preview
const ComprehensionPreview = ({ question, preview }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <FileText size={16} />
        <span>Reading Comprehension</span>
      </div>

      {/* Passage */}
      {question.passage && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h6 className="font-medium text-gray-900 dark:text-white mb-3">Passage:</h6>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {question.passage}
          </div>
        </div>
      )}

      {/* Sub Questions */}
      {question.subQuestions && question.subQuestions.length > 0 && (
        <div className="space-y-4">
          <h6 className="font-medium text-gray-900 dark:text-white">Questions:</h6>
          {question.subQuestions.map((subQuestion, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white mb-3 font-medium">
                {index + 1}. {subQuestion.text}
              </p>
              
              {subQuestion.type === 'multiple-choice' && subQuestion.options ? (
                <div className="space-y-2">
                  {subQuestion.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">{option}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                  {preview ? (
                    <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                      Text input field for answer
                    </p>
                  ) : (
                    <textarea
                      placeholder="Enter your answer..."
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white resize-none"
                      rows={2}
                      disabled
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(!question.passage && (!question.subQuestions || question.subQuestions.length === 0)) && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <p>No passage or questions configured</p>
        </div>
      )}
    </div>
  );
};

export default QuestionRenderer;