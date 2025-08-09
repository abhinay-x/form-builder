import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Eye, 
  BarChart3, 
  Copy, 
  Trash2,
  ExternalLink,
  Calendar,
  Users,
  Settings,
  Search
} from 'lucide-react';
import { formsAPI, apiHelpers } from '../services/api';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const response = await formsAPI.getForms();
      setForms(response.data);
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      toast.error(`Failed to load forms: ${errorInfo.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (formId, formTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${formTitle}"?`)) {
      return;
    }

    try {
      await formsAPI.deleteForm(formId);
      setForms(forms.filter(form => form._id !== formId));
      toast.success('Form deleted successfully');
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      toast.error(`Failed to delete form: ${errorInfo.message}`);
    }
  };

  const handleDuplicateForm = async (formId, formTitle) => {
    try {
      const response = await formsAPI.duplicateForm(formId);
      setForms([response.data, ...forms]);
      toast.success(`Form "${formTitle}" duplicated successfully`);
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      toast.error(`Failed to duplicate form: ${errorInfo.message}`);
    }
  };

  const handleTogglePublish = async (formId, currentStatus) => {
    try {
      console.log('Publishing form:', formId, 'Current status:', currentStatus, 'New status:', !currentStatus);
      const response = await formsAPI.publishForm(formId, !currentStatus);
      console.log('Publish response:', response.data);
      setForms(forms.map(form => 
        form._id === formId ? { ...form, isPublished: response.data.isPublished } : form
      ));
      toast.success(`Form ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Publish error:', error);
      const errorInfo = apiHelpers.handleError(error);
      toast.error(`Failed to ${!currentStatus ? 'publish' : 'unpublish'} form: ${errorInfo.message}`);
    }
  };

  const getFormUrl = (formId) => {
    return `${window.location.origin}/form/${formId}`;
  };

  const copyFormUrl = (formId, formTitle) => {
    const url = getFormUrl(formId);
    navigator.clipboard.writeText(url).then(() => {
      toast.success(`Form link copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
        <span className="ml-3 text-gray-600">Loading forms...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forms Dashboard</h1>
            <p className="mt-2 text-gray-600">Create, manage, and analyze your forms</p>
          </div>
          <Link
            to="/editor"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Form</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Forms</dt>
                <dd className="text-lg font-semibold text-gray-900">{forms.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Published</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {forms.filter(form => form.isPublished).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Responses</dt>
                <dd className="text-lg font-semibold text-gray-900">--</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg. Completion</dt>
                <dd className="text-lg font-semibold text-gray-900">--</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Forms Grid */}
      {filteredForms.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No forms found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new form.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                to="/editor"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Form</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <FormCard
              key={form._id}
              form={form}
              onDelete={handleDeleteForm}
              onDuplicate={handleDuplicateForm}
              onTogglePublish={handleTogglePublish}
              onCopyUrl={copyFormUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FormCard = ({ form, onDelete, onDuplicate, onTogglePublish, onCopyUrl }) => {
  return (
    <div className="card-hover">
      {/* Header Image */}
      {form.headerImage && (
        <div className="mb-4">
          <img
            src={apiHelpers.getImageUrl(form.headerImage)}
            alt="Form header"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Form Title and Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.title}</h3>
        {form.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
        )}
      </div>

      {/* Form Stats */}
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

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          form.isPublished 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {form.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Link
            to={`/editor/${form._id}`}
            className="btn-outline text-xs px-3 py-1.5"
          >
            <Settings className="w-3 h-3 mr-1" />
            Edit
          </Link>
          
          {form.isPublished && (
            <Link
              to={`/form/${form._id}`}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Link>
          )}
          <Link
            to={`/form/${form._id}`}
            className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            <FileText className="w-4 h-4" />
            Respond
          </Link>
        </div>

        {/* Dropdown Menu */}
        <div className="relative group">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <button
              onClick={() => onTogglePublish(form._id, form.isPublished)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="w-4 h-4 mr-3" />
              {form.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            
            {form.isPublished && (
              <button
                onClick={() => onCopyUrl(form._id, form.title)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Copy className="w-4 h-4 mr-3" />
                Copy Link
              </button>
            )}
            
            <Link
              to={`/results/${form._id}`}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              View Results
            </Link>
            
            <button
              onClick={() => onDuplicate(form._id, form.title)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Copy className="w-4 h-4 mr-3" />
              Duplicate
            </button>
            
            <hr className="my-1" />
            
            <button
              onClick={() => onDelete(form._id, form.title)}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;