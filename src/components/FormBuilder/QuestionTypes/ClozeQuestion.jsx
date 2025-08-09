import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';

const ClozeQuestion = ({ question = {}, onUpdate, isPreview, onAnswer }) => {
  const sentence = question.sentence || '';
  const blanks = question.blanks || [];
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    if (question.sentence) {
      setSentence(question.sentence);
    }
    if (question.blanks) {
      setBlanks(question.blanks);
    }
  }, [question]);

  const [sentenceState, setSentence] = useState(sentence);
  const [blanksState, setBlanks] = useState(blanks);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Parse sentence and extract blanks
  const parseSentence = (text) => {
    const regex = /\[([^\]]+)\]/g;
    const parts = [];
    const foundBlanks = [];
    let lastIndex = 0;
    let match;
    let blankIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the blank
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add the blank
      const blankId = blanksState[blankIndex]?.id || generateId();
      parts.push({
        type: 'blank',
        id: blankId,
        answer: match[1],
        position: blankIndex
      });

      foundBlanks.push({
        id: blankId,
        answer: match[1],
        position: blankIndex
      });

      lastIndex = match.index + match[0].length;
      blankIndex++;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return { parts, blanks: foundBlanks };
  };

  const handleSentenceChange = (newSentence) => {
    setSentence(newSentence);
    
    if (!isPreview && onUpdate) {
      const { blanks: newBlanks } = parseSentence(newSentence);
      setBlanks(newBlanks);
      
      onUpdate(question.id, {
        sentence: newSentence,
        blanks: newBlanks
      });
    }
  };

  const handleBlankAnswerChange = (blankId, answer) => {
    const newBlanks = blanksState.map(blank =>
      blank.id === blankId ? { ...blank, answer } : blank
    );
    
    setBlanks(newBlanks);
    
    if (!isPreview && onUpdate) {
      onUpdate(question.id, { blanks: newBlanks });
    }
  };

  const handleUserAnswerChange = (blankId, answer) => {
    const newAnswers = { ...userAnswers, [blankId]: answer };
    setUserAnswers(newAnswers);
    
    if (onAnswer) {
      onAnswer(question.id, {
        blanks: Object.entries(newAnswers).map(([blankId, answer]) => ({
          blankId,
          answer
        }))
      });
    }
  };

  const addExampleBlank = () => {
    const newSentence = sentenceState + ' [blank]';
    handleSentenceChange(newSentence);
  };

  const { parts } = parseSentence(sentenceState);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            {onAnswer ? (
              <p>Fill in the blanks with the correct words.</p>
            ) : (
              <div>
                <p className="font-medium mb-2">How to create blanks:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Wrap the answer in square brackets: <code className="bg-blue-100 px-1 rounded">[answer]</code></li>
                  <li>Example: "The sky is [blue] and the grass is [green]."</li>
                  <li>Students will see input fields instead of the bracketed words</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sentence Editor/Display */}
      <div className="space-y-4">
        {onAnswer || isPreview ? (
          /* Display mode for preview and form filling */
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-lg leading-relaxed flex flex-wrap items-baseline gap-2">
              {parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <span key={index} className="text-gray-900">
                      {part.content}
                    </span>
                  );
                } else {
                  return (
                    <input
                      key={part.id}
                      type="text"
                      value={userAnswers[part.id] || ''}
                      onChange={(e) => handleUserAnswerChange(part.id, e.target.value)}
                      className="cloze-blank inline-block min-w-[100px] px-2 py-1 mx-1 border-b-2 border-primary-400 bg-transparent text-center focus:outline-none focus:border-primary-600"
                      placeholder="___"
                      disabled={isPreview}
                    />
                  );
                }
              })}
            </div>
          </div>
        ) : (
          /* Edit mode */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sentence with blanks
              </label>
              <textarea
                value={sentenceState}
                onChange={(e) => handleSentenceChange(e.target.value)}
                className="textarea-field"
                rows={4}
                placeholder="Enter your sentence with blanks in square brackets, e.g., 'The [quick] brown fox jumps over the [lazy] dog.'"
              />
            </div>

            <button
              onClick={addExampleBlank}
              className="btn-outline text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add blank at end</span>
            </button>
          </div>
        )}
      </div>

      {/* Preview of parsed sentence */}
      {!onAnswer && !isPreview && sentenceState && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-lg leading-relaxed flex flex-wrap items-baseline gap-2">
              {parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <span key={index} className="text-gray-900">
                      {part.content}
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={part.id}
                      className="inline-block min-w-[100px] px-2 py-1 mx-1 border-b-2 border-primary-400 bg-white text-center"
                    >
                      ___
                    </span>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* Answer Key (Edit mode only) */}
      {!onAnswer && !isPreview && blanksState.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Answer Key:</h4>
          <div className="space-y-3">
            {blanksState.map((blank, index) => (
              <div key={blank.id} className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 w-16">
                  Blank {index + 1}:
                </span>
                <input
                  type="text"
                  value={blank.answer}
                  onChange={(e) => handleBlankAnswerChange(blank.id, e.target.value)}
                  className="input-field flex-1 max-w-xs"
                  placeholder="Correct answer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {!onAnswer && sentenceState && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Total blanks: {blanksState.length}</span>
            <span>Word count: {sentenceState.replace(/\[.*?\]/g, '___').split(/\s+/).filter(w => w.length > 0).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

ClozeQuestion.defaultProps = {
  question: {
    sentence: '',
    blanks: []
  }
};

export default ClozeQuestion;