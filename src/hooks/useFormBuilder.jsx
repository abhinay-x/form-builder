import { useState, useCallback } from 'react';

const useFormBuilder = (initialForm = null) => {
  const [form, setForm] = useState(initialForm || {
    title: 'Untitled Form',
    description: '',
    headerImage: null,
    questions: [],
    isPublished: false
  });

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Update form basic info
  const updateForm = useCallback((updates) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  // Add new question
  const addQuestion = useCallback((type) => {
    const newQuestion = {
      id: Date.now().toString(),
      type,
      title: 'Untitled Question',
      image: null,
      config: getDefaultConfig(type),
      required: false,
      order: form.questions.length
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setSelectedQuestion(newQuestion.id);
  }, [form.questions.length]);

  // Update question
  const updateQuestion = useCallback((questionId, updates) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  }, []);

  // Delete question
  const deleteQuestion = useCallback((questionId) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
    }
  }, [selectedQuestion]);

  // Reorder questions
  const reorderQuestions = useCallback((startIndex, endIndex) => {
    setForm(prev => {
      const newQuestions = Array.from(prev.questions);
      const [reorderedItem] = newQuestions.splice(startIndex, 1);
      newQuestions.splice(endIndex, 0, reorderedItem);
      
      // Update order values
      const updatedQuestions = newQuestions.map((q, index) => ({ ...q, order: index }));
      
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

  return {
    form,
    setForm,
    selectedQuestion,
    setSelectedQuestion,
    isPreviewMode,
    setIsPreviewMode,
    updateForm,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions
  };
};

// Default configurations for each question type
const getDefaultConfig = (type) => {
  switch (type) {
    case 'categorize':
      return {
        categories: [
          { id: '1', name: 'Category 1', color: '#3B82F6' },
          { id: '2', name: 'Category 2', color: '#EF4444' }
        ],
        items: [
          { id: '1', text: 'Item 1', correctCategory: '1' },
          { id: '2', text: 'Item 2', correctCategory: '2' }
        ]
      };
    
    case 'cloze':
      return {
        text: 'The {{capital}} of France is {{city}}.',
        image: null,
        blanks: [
          { id: '0', placeholder: 'capital', type: 'input', correctAnswer: 'capital' },
          { id: '1', placeholder: 'city', type: 'input', correctAnswer: 'Paris' }
        ]
      };
    
    case 'comprehension':
      return {
        passage: 'Enter your reading passage here...',
        questions: [
          {
            id: '1',
            type: 'multiple-choice',
            question: 'What is the main idea?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 'Option A'
          }
        ]
      };
    
    default:
      return {};
  }
};

export default useFormBuilder;