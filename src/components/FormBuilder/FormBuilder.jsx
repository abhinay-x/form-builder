import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Plus, 
  Save, 
  Eye, 
  Settings, 
  Image as ImageIcon,
  Trash2,
  Copy,
  Move,
  Edit3
} from 'lucide-react';
import { toast } from 'react-hot-toast';


import CategorizeQuestion from './QuestionTypes/CategorizeQuestion';
import ClozeQuestion from './QuestionTypes/ClozeQuestion';
import ComprehensionQuestion from './QuestionTypes/ComprehensionQuestion';
import ImageUpload from '../common/ImageUpload';
import { formsAPI, apiHelpers } from '../../services/api';

const QUESTION_TYPES = [
  {
    id: 'categorize',
    name: 'Categorize',
    description: 'Drag items into categories',
    icon: '📂',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'cloze',
    name: 'Cloze (Fill in blanks)',
    description: 'Fill in the missing words',
    icon: '📝',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'comprehension',
    name: 'Comprehension',
    description: 'Passage with questions',
    icon: '📖',
    color: 'bg-purple-100 text-purple-800'
  }
];

const FormBuilder = ({ formId, onSave, initialData }) => {
  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    headerImage: '',
    questions: [],
    settings: {
      allowMultipleSubmissions: false,
      showProgressBar: true,
      randomizeQuestions: false
    }
  });

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else if (formId) {
      loadForm();
    }
  }, [formId, initialData]);

  const loadForm = async () => {
    try {
      const response = await formsAPI.getForm(formId);
      setForm(response.data);
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      toast.error(`Failed to load form: ${errorInfo.message}`);
    }
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: generateId(),
      type,
      title: `New ${QUESTION_TYPES.find(qt => qt.id === type)?.name} Question`,
      description: '',
      image: '',
      required: false,
      // Type-specific defaults
      ...(type === 'categorize' && {
        categories: [
          { id: generateId(), name: 'Category 1', items: [] },
          { id: generateId(), name: 'Category 2', items: [] }
        ],
        items: [
          { id: generateId(), text: 'Item 1', image: '' },
          { id: generateId(), text: 'Item 2', image: '' }
        ]
      }),
      ...(type === 'cloze' && {
        sentence: 'The quick [brown] fox jumps over the [lazy] dog.',
        blanks: [
          { id: generateId(), answer: 'brown', position: 1 },
          { id: generateId(), answer: 'lazy', position: 2 }
        ]
      }),
      ...(type === 'comprehension' && {
        passage: 'Enter your passage text here...',
        subQuestions: [
          {
            id: generateId(),
            question: 'What is the main idea of this passage?',
            type: 'multiple-choice',
            options: [
              { id: generateId(), text: 'Option A', image: '' },
              { id: generateId(), text: 'Option B', image: '' }
            ],
            correctAnswer: 'Option A',
            points: 1
          }
        ]
      })
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setSelectedQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId, updates) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (questionId) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    
    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
    }
  };

  const duplicateQuestion = (questionId) => {
    const question = form.questions.find(q => q.id === questionId);
    if (question) {
      const duplicated = {
        ...question,
        id: generateId(),
        title: `${question.title} (Copy)`
      };
      
      setForm(prev => ({
        ...prev,
        questions: [...prev.questions, duplicated]
      }));
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(form.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setForm(prev => ({
      ...prev,
      questions: items
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    try {
      setSaving(true);
      let response;
      
      if (formId) {
        response = await formsAPI.updateForm(formId, form);
      } else {
        response = await formsAPI.createForm(form);
      }
      
      toast.success('Form saved successfully!');
      if (onSave) {
        onSave(response.data);
      }
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      toast.error(`Failed to save form: ${errorInfo.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleHeaderImageUpload = async (file) => {
    try {
      const response = await formsAPI.uploadImage(file);
      setForm(prev => ({
        ...prev,
        headerImage: response.data.imageUrl
      }));
      toast.success('Header image uploaded successfully!');
    } catch (error) {
      const errorInfo = apiHelpers.handleError(error);
      toast.error(`Failed to upload image: ${errorInfo.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="form-builder-sidebar">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Form Builder</h2>
        </div>

        {/* Question Types */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Add Question</h3>
          <div className="space-y-2">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => addQuestion(type.id)}
                className="question-type-item w-full"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{type.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{type.name}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Questions List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Questions ({form.questions.length})</h3>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {form.questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-3 bg-white rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedQuestion === question.id 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          onClick={() => setSelectedQuestion(question.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2 text-gray-400 hover:text-gray-600"
                                >
                                  <Move className="w-4 h-4" />
                                </div>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full mr-2">
                                  {QUESTION_TYPES.find(t => t.id === question.type)?.name}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 truncate mt-1">
                                {question.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                placeholder="Form Title"
              />
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-1"
                placeholder="Form description (optional)"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-outline flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                {saving ? (
                  <div className="loading-spinner" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="form-builder-main">
          {showPreview ? (
            <FormPreview form={form} />
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Header Image Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Header Image</h3>
                <ImageUpload
                  currentImage={form.headerImage}
                  onImageUpload={handleHeaderImageUpload}
                  onImageRemove={() => setForm(prev => ({ ...prev, headerImage: '' }))}
                  className="w-full h-48"
                />
              </div>

              {/* Questions */}
              {form.questions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                    📝
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                  <p className="text-gray-500 mb-6">Add your first question from the sidebar</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {form.questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      isSelected={selectedQuestion === question.id}
                      onSelect={setSelectedQuestion}
                      onUpdate={updateQuestion}
                      onDelete={deleteQuestion}
                      onDuplicate={duplicateQuestion}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Question Editor Panel */}
      {selectedQuestion && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Question</h3>
            <button 
              onClick={() => setSelectedQuestion(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question Text
              </label>
              <input
                type="text"
                value={form.questions.find(q => q.id === selectedQuestion)?.text || ''}
                onChange={(e) => updateQuestion(selectedQuestion, { text: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Enter question text"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Question Type
              </label>
              <select
                value={form.questions.find(q => q.id === selectedQuestion)?.type || ''}
                onChange={(e) => updateQuestion(selectedQuestion, { type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {QUESTION_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={form.settings}
          onUpdate={(settings) => setForm(prev => ({ ...prev, settings }))}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

const QuestionCard = ({ question, index, isSelected, onSelect, onUpdate, onDelete, onDuplicate }) => {
  const renderQuestion = () => {
    switch (question.type) {
      case 'categorize':
        return <CategorizeQuestion question={question} isPreview />;
      case 'cloze':
        return <ClozeQuestion question={question} isPreview />;
      case 'comprehension':
        return <ComprehensionQuestion question={question} isPreview />;
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div
      className={`question-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(question.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">
            Question {index + 1}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            QUESTION_TYPES.find(t => t.id === question.type)?.color || 'bg-gray-100 text-gray-800'
          }`}>
            {QUESTION_TYPES.find(t => t.id === question.type)?.name}
          </span>
          {question.required && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
              Required
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(question.id);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(question.id);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(question.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {renderQuestion()}
    </div>
  );
};

const FormPreview = ({ form }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Header */}
        {form.headerImage && (
          <div className="mb-8">
            <img
              src={apiHelpers.getImageUrl(form.headerImage)}
              alt="Form header"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {form.questions.map((question, index) => (
            <div key={question.id} className="border-l-4 border-primary-500 pl-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {index + 1}. {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {question.description && (
                  <p className="text-gray-600 mt-1">{question.description}</p>
                )}
              </div>

              {question.image && (
                <div className="mb-4">
                  <img
                    src={apiHelpers.getImageUrl(question.image)}
                    alt="Question image"
                    className="max-w-md h-auto rounded-lg"
                  />
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                {question.type === 'categorize' && <CategorizeQuestion question={question} isPreview />}
                {question.type === 'cloze' && <ClozeQuestion question={question} isPreview />}
                {question.type === 'comprehension' && <ComprehensionQuestion question={question} isPreview />}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="btn-primary w-full md:w-auto">
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel = ({ settings, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Form Settings</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.allowMultipleSubmissions}
                onChange={(e) => onUpdate({
                  ...settings,
                  allowMultipleSubmissions: e.target.checked
                })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Allow multiple submissions
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Users can submit the form multiple times
            </p>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.showProgressBar}
                onChange={(e) => onUpdate({
                  ...settings,
                  showProgressBar: e.target.checked
                })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Show progress bar
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Display completion progress to users
            </p>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.randomizeQuestions}
                onChange={(e) => onUpdate({
                  ...settings,
                  randomizeQuestions: e.target.checked
                })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Randomize questions
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Show questions in random order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;