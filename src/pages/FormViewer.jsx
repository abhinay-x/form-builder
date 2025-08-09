import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { formsAPI, responsesAPI } from '../services/api';
import CategorizeQuestion from '../components/FormBuilder/QuestionTypes/CategorizeQuestion';
import ClozeQuestion from '../components/FormBuilder/QuestionTypes/ClozeQuestion';
import ComprehensionQuestion from '../components/FormBuilder/QuestionTypes/ComprehensionQuestion';

const FormViewer = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await formsAPI.getForm(id);
      setForm(response.data);
    } catch (err) {
      setError('Form not found or failed to load');
      console.error('Error fetching form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const getErrorMessage = (error) => {
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || errorData?.error || error.message;
    
    // Handle specific error cases with user-friendly messages
    if (errorMessage?.includes('Form is not published')) {
      return {
        title: 'Form Not Available',
        message: 'This form is currently not available for responses. Please contact the form creator if you believe this is an error.',
        isUserError: true
      };
    }
    
    if (errorMessage?.includes('Form not found')) {
      return {
        title: 'Form Not Found',
        message: 'The form you are trying to access does not exist or has been removed.',
        isUserError: true
      };
    }
    
    if (error.response?.status === 403) {
      return {
        title: 'Access Denied',
        message: 'You do not have permission to submit responses to this form.',
        isUserError: true
      };
    }
    
    if (error.response?.status >= 500) {
      return {
        title: 'Server Error',
        message: 'There was a problem processing your submission. Please try again later.',
        isUserError: false
      };
    }
    
    // Default error for other cases
    return {
      title: 'Submission Failed',
      message: errorMessage || 'An unexpected error occurred while submitting your response.',
      isUserError: false
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null); // Clear any previous errors
      console.log('Submitting form:', id, 'with responses:', responses);
      
      const response = await responsesAPI.createResponse({
        formId: id,
        answers: responses
      });
      
      console.log('Form submission successful:', response.data);
      setSubmitted(true);
    } catch (err) {
      const errorInfo = getErrorMessage(err);
      setError(errorInfo);
      console.error('Submission error details:', err.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const value = responses[question.id];
    const onChange = (answer) => handleAnswerChange(question.id, answer);

    switch (question.type) {
      case 'categorize':
        return (
          <CategorizeQuestion
            key={question.id}
            config={question.config}
            value={value}
            onChange={onChange}
            mode="preview"
          />
        );
      
      case 'cloze':
        return (
          <ClozeQuestion
            key={question.id}
            config={question.config}
            value={value}
            onChange={onChange}
            mode="preview"
          />
        );
      
      case 'comprehension':
        return (
          <ComprehensionQuestion
            key={question.id}
            config={question.config}
            value={value}
            onChange={onChange}
            mode="preview"
          />
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">{error.title}</h2>
          <p className="text-red-700 mb-6">{error.message}</p>
          {error.isUserError && (
            <div className="bg-red-100 border border-red-300 rounded-md p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> This appears to be a form availability issue. If you're the form creator, 
                please ensure your form is published and accessible.
              </p>
            </div>
          )}
          <button
            onClick={() => window.history.back()}
            className="btn-outline text-red-700 border-red-300 hover:bg-red-50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600">Your response has been submitted successfully.</p>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Form Header */}
        {form.headerImage && (
          <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={form.headerImage}
              alt="Form header"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>
            {form.description && (
              <p className="text-gray-600 text-lg leading-relaxed">{form.description}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {form.questions.map((question, index) => (
              <div key={question.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {index + 1}. {question.title}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  
                  {question.image && (
                    <div className="mb-4">
                      <img
                        src={question.image}
                        alt="Question image"
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
                
                {renderQuestion(question)}
              </div>
            ))}

            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormViewer;