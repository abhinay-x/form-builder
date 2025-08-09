import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

import FormBuilder from '../components/FormBuilder/FormBuilder';
import { formsAPI, apiHelpers } from '../services/api';

const FormEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadForm();
    }
  }, [id]);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await formsAPI.getForm(id);
      setFormData(response.data);
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      setError(errorInfo.message);
      toast.error(`Failed to load form: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedForm) => {
    toast.success('Form saved successfully!');
    // If it's a new form, navigate to the edit page with the new ID
    if (!id && savedForm._id) {
      navigate(`/editor/${savedForm._id}`, { replace: true });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Form</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={loadForm}
              className="btn-primary"
            >
              Try Again
            </button>
            <button
              onClick={handleBack}
              className="btn-outline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {id ? 'Edit Form' : 'Create New Form'}
            </h1>
            <p className="text-sm text-gray-500">
              {id ? 'Make changes to your form' : 'Build your custom form with interactive questions'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Builder */}
      <div className="h-[calc(100vh-80px)]">
        <FormBuilder
          formId={id}
          initialData={formData}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default FormEditor;