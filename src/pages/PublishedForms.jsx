import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formsAPI, apiHelpers } from '../services/api';
import { toast } from 'react-hot-toast';
import { Calendar, FileText } from 'lucide-react';

const PublishedForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedForms();
  }, []);

  const fetchPublishedForms = async () => {
    try {
      setLoading(true);
      const response = await formsAPI.getForms();
      console.log('All forms:', response.data);
      const publishedForms = response.data.filter(form => form.isPublished);
      console.log('Published forms:', publishedForms);
      setForms(publishedForms);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load published forms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Published Forms</h1>
      
      {forms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No published forms available at the moment.</p>
          <p className="text-gray-400 text-sm mt-2">Forms need to be published before they appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map(form => (
          <div key={form._id} className="card-hover">
            {form.headerImage && (
              <div className="mb-4">
                <img
                  src={apiHelpers.getImageUrl(form.headerImage)}
                  alt="Form header"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.title}</h3>
              {form.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(form.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {form.questions?.length || 0} questions
              </div>
            </div>

            <Link
              to={`/form/${form._id}`}
              className="btn-primary w-full text-center py-2"
            >
              Respond to Form
            </Link>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishedForms;
