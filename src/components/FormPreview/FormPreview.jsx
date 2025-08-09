import React from 'react';
import { Clock, FileText, Eye } from 'lucide-react';
import QuestionRenderer from './QuestionRenderer';

const FormPreview = ({ form, className = '' }) => {
  if (!form) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center ${className}`}>
        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No form to preview</p>
      </div>
    );
  }

  const estimatedTime = Math.ceil(form.questions.length * 2);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Form Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        {form.headerImage && (
          <div className="mb-4">
            <img
              src={form.headerImage}
              alt="Form header"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {form.title || 'Untitled Form'}
            </h2>
            {form.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {form.description}
              </p>
            )}
          </div>
        </div>

        {/* Form Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <FileText size={16} />
            <span>{form.questions.length} questions</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} />
            <span>~{estimatedTime} minutes</span>
          </div>
        </div>
      </div>

      {/* Questions Preview */}
      <div className="p-6">
        {form.questions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No questions added yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Add questions to see the preview
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {form.questions.map((question, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Question {index + 1}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {question.type}
                  </span>
                </div>
                <QuestionRenderer question={question} preview={true} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Footer */}
      {form.questions.length > 0 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Form preview • {form.questions.length} questions
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Estimated completion time: {estimatedTime} minutes
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPreview;