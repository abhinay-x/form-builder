import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const QuestionFiller = ({ question, response, onChange }) => {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'categorize':
        return <CategorizeQuestionFiller question={question} response={response} onChange={onChange} />;
      case 'cloze':
        return <ClozeQuestionFiller question={question} response={response} onChange={onChange} />;
      case 'comprehension':
        return <ComprehensionQuestionFiller question={question} response={response} onChange={onChange} />;
      default:
        return <TextQuestionFiller question={question} response={response} onChange={onChange} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {question.text}
        </h4>
        {question.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {question.description}
          </p>
        )}
        {question.image && (
          <img
            src={question.image}
            alt="Question"
            className="mt-3 max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
          />
        )}
      </div>

      {/* Question Content */}
      <DndProvider backend={HTML5Backend}>
        {renderQuestionContent()}
      </DndProvider>
    </div>
  );
};

// Text Question Filler
const TextQuestionFiller = ({ question, response, onChange }) => {
  return (
    <div>
      <textarea
        value={response || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your answer..."
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
        rows={4}
      />
    </div>
  );
};

// Categorize Question Filler
const CategorizeQuestionFiller = ({ question, response, onChange }) => {
  const [categories, setCategories] = useState(response?.categories || {});
  const [unassignedItems, setUnassignedItems] = useState([]);

  useEffect(() => {
    // Initialize unassigned items
    const assignedItems = new Set();
    Object.values(categories).forEach(categoryItems => {
      categoryItems.forEach(item => assignedItems.add(item));
    });

    const unassigned = question.items.filter(item => !assignedItems.has(item));
    setUnassignedItems(unassigned);
  }, [question.items, categories]);

  useEffect(() => {
    onChange({ categories });
  }, [categories, onChange]);

  const moveItem = (item, targetCategory) => {
    setCategories(prev => {
      const newCategories = { ...prev };
      
      // Remove item from all categories
      Object.keys(newCategories).forEach(cat => {
        newCategories[cat] = newCategories[cat].filter(i => i !== item);
      });

      // Add to target category
      if (targetCategory) {
        if (!newCategories[targetCategory]) {
          newCategories[targetCategory] = [];
        }
        newCategories[targetCategory].push(item);
      }

      return newCategories;
    });
  };

  return (
    <div className="space-y-6">
      {/* Unassigned Items */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 dark:text-white mb-3">Items to Categorize</h5>
        <div className="flex flex-wrap gap-2">
          {unassignedItems.map((item, index) => (
            <DraggableItem
              key={index}
              item={item}
              onMove={moveItem}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.categories.map((category, index) => (
          <CategoryDropZone
            key={index}
            category={category}
            items={categories[category] || []}
            onMove={moveItem}
          />
        ))}
      </div>
    </div>
  );
};

// Draggable Item Component
const DraggableItem = ({ item, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item: { item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg cursor-move transition-opacity ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="text-sm text-gray-900 dark:text-white">{item}</span>
    </div>
  );
};

// Category Drop Zone Component
const CategoryDropZone = ({ category, items, onMove }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'item',
    drop: (draggedItem) => {
      onMove(draggedItem.item, category);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`border-2 border-dashed rounded-lg p-4 min-h-[120px] transition-colors ${
        isOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600'
      }`}
    >
      <h6 className="font-medium text-gray-900 dark:text-white mb-3">{category}</h6>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="px-3 py-2 bg-blue-100 dark:bg-blue-800 rounded-lg cursor-pointer"
            onClick={() => onMove(item, null)}
          >
            <span className="text-sm text-blue-900 dark:text-blue-100">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Cloze Question Filler
const ClozeQuestionFiller = ({ question, response, onChange }) => {
  const [blanks, setBlanks] = useState(response?.blanks || {});

  useEffect(() => {
    onChange({ blanks });
  }, [blanks, onChange]);

  const handleBlankChange = (blankIndex, value) => {
    setBlanks(prev => ({
      ...prev,
      [blankIndex]: value
    }));
  };

  const renderTextWithBlanks = () => {
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
          <input
            key={`blank-${index}`}
            type="text"
            value={blanks[index] || ''}
            onChange={(e) => handleBlankChange(index, e.target.value)}
            className="inline-block mx-1 px-2 py-1 border-b-2 border-blue-500 bg-transparent focus:outline-none focus:border-blue-700 min-w-[100px] text-center"
            placeholder="..."
          />
        );
      }
    });

    return result;
  };

  return (
    <div className="space-y-4">
      <div className="text-lg leading-relaxed">
        {renderTextWithBlanks()}
      </div>
      
      {question.options && question.options.length > 0 && (
        <div className="mt-6">
          <h6 className="font-medium text-gray-900 dark:text-white mb-3">Available Options:</h6>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
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

// Comprehension Question Filler
const ComprehensionQuestionFiller = ({ question, response, onChange }) => {
  const [subAnswers, setSubAnswers] = useState(response?.subAnswers || {});

  useEffect(() => {
    onChange({ subAnswers });
  }, [subAnswers, onChange]);

  const handleSubAnswerChange = (questionIndex, answer) => {
    setSubAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  return (
    <div className="space-y-6">
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
      <div className="space-y-4">
        <h6 className="font-medium text-gray-900 dark:text-white">Questions:</h6>
        {question.subQuestions.map((subQuestion, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <p className="text-gray-900 dark:text-white mb-3">
              {index + 1}. {subQuestion.text}
            </p>
            
            {subQuestion.type === 'multiple-choice' ? (
              <div className="space-y-2">
                {subQuestion.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`sub-question-${index}`}
                      value={option}
                      checked={subAnswers[index] === option}
                      onChange={(e) => handleSubAnswerChange(index, e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={subAnswers[index] || ''}
                onChange={(e) => handleSubAnswerChange(index, e.target.value)}
                placeholder="Enter your answer..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionFiller;