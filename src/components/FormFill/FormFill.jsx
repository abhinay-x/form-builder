import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Clock, User, FileText, Send } from 'lucide-react';
import QuestionFiller from './QuestionFiller';
import Loading from '../common/Loading';
import { api } from '../../services/api';

const FormFill = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/forms/${formId}`);
      setForm(response.data);
      
      // Initialize responses object
      const initialResponses = {};
      response.data.questions.forEach((question, index) => {
        initialResponses[index] = {
          questionId: question._id,
          questionType: question.type,
          answer: getInitialAnswer(question.type)
        };
      });
      setResponses(initialResponses);
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Failed to load form');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getInitialAnswer = (questionType) => {
    switch (questionType) {
      case 'categorize':
        return { categories: {} };
      case 'cloze':
        return { blanks: {} };
      case 'comprehension':
        return { subAnswers: {} };
      default:
        return '';
    }
  };

  const handleResponseChange = (questionIndex, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        answer
      }
    }));
  };

  const validateResponses = () => {
    const errors = [];
    
    form.questions.forEach((question, index) => {
      const response = responses[index];
      
      if (!response || !response.answer) {
        errors.push(`Question ${index + 1} is required`);
        return;
      }

      // Validate based on question type
      switch (question.type) {
        case 'categorize':
          if (!response.answer.categories || Object.keys(response.answer.categories).length === 0) {
            errors.push(`Please categorize items in question ${index + 1}`);
          }
          break;
        case 'cloze':
          if (!response.answer.blanks || Object.keys(response.answer.blanks).length === 0) {
            errors.push(`Please fill in the blanks in question ${index + 1}`);
          }
          break;
        case 'comprehension':
          if (!response.answer.subAnswers || Object.keys(response.answer.subAnswers).length === 0) {
            errors.push(`Please answer all sub-questions in question ${index + 1}`);
          }
          break;
        default:
          if (!response.answer.trim()) {
            errors.push(`Question ${index + 1} is required`);
          }
      }
    });

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateResponses();
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSubmitting(true);
      
      const submissionData = {
        formId: form._id,
        responses: Object.values(responses).map(response => ({
          questionId: response.questionId,
          questionType: response.questionType,
          answer: response.answer
        }))
      };

      await api.post('/responses', submissionData);
      toast.success('Form submitted successfully!');
      navigate(`/form/${formId}/success`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < form.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getProgress = () => {
    const answered = Object.values(responses).filter(response => {
      if (!response.answer) return false;
      
      switch (response.questionType) {
        case 'categorize':
          return response.answer.categories && Object.keys(response.answer.categories).length > 0;
        case 'cloze':
          return response.answer.blanks && Object.keys(response.answer.blanks).length > 0;
        case 'comprehension':
          return response.answer.subAnswers && Object.keys(response.answer.subAnswers).length > 0;
        default:
          return response.answer.trim().length > 0;
      }
    }).length;
    
    return Math.round((answered / form.questions.length) * 100);
  };

  if (loading) {
    return <Loading fullScreen text="Loading form..." />;
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Form Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The form you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Form Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          {form.headerImage && (
            <img
              src={form.headerImage}
              alt="Form header"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {form.description}
            </p>
          )}
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <FileText size={16} />
              <span>{form.questions.length} questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>~{Math.ceil(form.questions.length * 2)} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <User size={16} />
              <span>Progress: {getProgress()}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowAllQuestions(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !showAllQuestions
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              One by One
            </button>
            <button
              onClick={() => setShowAllQuestions(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showAllQuestions
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All Questions
            </button>
          </div>
        </div>

        {/* Questions */}
        {showAllQuestions ? (
          // Show all questions
          <div className="space-y-6">
            {form.questions.map((question, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Question {index + 1}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {question.type}
                  </span>
                </div>
                <QuestionFiller
                  question={question}
                  response={responses[index]?.answer}
                  onChange={(answer) => handleResponseChange(index, answer)}
                />
              </div>
            ))}
          </div>
        ) : (
          // Show one question at a time
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question {currentQuestionIndex + 1} of {form.questions.length}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {form.questions[currentQuestionIndex].type}
              </span>
            </div>
            
            <QuestionFiller
              question={form.questions[currentQuestionIndex]}
              response={responses[currentQuestionIndex]?.answer}
              onChange={(answer) => handleResponseChange(currentQuestionIndex, answer)}
            />

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === form.questions.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Submit Form</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormFill;