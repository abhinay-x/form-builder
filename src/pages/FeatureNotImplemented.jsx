import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Construction, ArrowLeft, Code, AlertTriangle } from 'lucide-react';

const FeatureNotImplemented = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {/* Icon */}
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full">
            <Construction className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Feature Under Development
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-6">
            The form response feature is currently being developed and is not yet available.
          </p>

          {/* Debug Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Code className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Debug Information</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Route:</strong> /form/{id || 'undefined'}</p>
              <p><strong>Feature:</strong> Form Response Submission</p>
              <p><strong>Status:</strong> In Development</p>
              <p><strong>Expected:</strong> Coming Soon</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-6">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Work in Progress
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/published"
              className="btn-primary inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Published Forms
            </Link>
            
            <Link
              to="/"
              className="btn-outline inline-flex items-center justify-center"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              This is a placeholder page for development purposes. 
              The form response functionality will be implemented in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureNotImplemented;
