// Form validation helpers
export const validateForm = (form) => {
  const errors = [];

  if (!form.title || form.title.trim().length === 0) {
    errors.push('Form title is required');
  }

  if (!form.questions || form.questions.length === 0) {
    errors.push('At least one question is required');
  }

  form.questions?.forEach((question, index) => {
    const questionErrors = validateQuestion(question, index + 1);
    errors.push(...questionErrors);
  });

  return errors;
};

export const validateQuestion = (question, questionNumber) => {
  const errors = [];
  const prefix = `Question ${questionNumber}:`;

  if (!question.text || question.text.trim().length === 0) {
    errors.push(`${prefix} Question text is required`);
  }

  if (!question.type) {
    errors.push(`${prefix} Question type is required`);
  }

  // Type-specific validation
  switch (question.type) {
    case 'categorize':
      if (!question.items || question.items.length === 0) {
        errors.push(`${prefix} Items to categorize are required`);
      }
      if (!question.categories || question.categories.length === 0) {
        errors.push(`${prefix} Categories are required`);
      }
      break;

    case 'cloze':
      if (!question.text || !question.text.includes('___')) {
        errors.push(`${prefix} Text must contain blanks (___)`);
      }
      break;

    case 'comprehension':
      if (!question.passage || question.passage.trim().length === 0) {
        errors.push(`${prefix} Passage is required`);
      }
      if (!question.subQuestions || question.subQuestions.length === 0) {
        errors.push(`${prefix} Sub-questions are required`);
      }
      break;
  }

  return errors;
};

// Response validation helpers
export const validateResponse = (response, question) => {
  const errors = [];

  if (!response || !response.answer) {
    errors.push('Answer is required');
    return errors;
  }

  switch (question.type) {
    case 'categorize':
      if (!response.answer.categories || Object.keys(response.answer.categories).length === 0) {
        errors.push('Please categorize all items');
      }
      break;

    case 'cloze':
      if (!response.answer.blanks || Object.keys(response.answer.blanks).length === 0) {
        errors.push('Please fill in all blanks');
      }
      break;

    case 'comprehension':
      if (!response.answer.subAnswers || Object.keys(response.answer.subAnswers).length === 0) {
        errors.push('Please answer all sub-questions');
      }
      break;

    default:
      if (!response.answer.trim()) {
        errors.push('Answer cannot be empty');
      }
  }

  return errors;
};

// Date and time helpers
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
};

// Time formatting helpers
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

// String helpers
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Array helpers
export const moveArrayItem = (array, fromIndex, toIndex) => {
  const newArray = [...array];
  const item = newArray.splice(fromIndex, 1)[0];
  newArray.splice(toIndex, 0, item);
  return newArray;
};

export const removeArrayItem = (array, index) => {
  return array.filter((_, i) => i !== index);
};

export const addArrayItem = (array, item, index = -1) => {
  const newArray = [...array];
  if (index === -1) {
    newArray.push(item);
  } else {
    newArray.splice(index, 0, item);
  }
  return newArray;
};

// Object helpers
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// File helpers
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

export const isImageFile = (file) => {
  if (!file) return false;
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(file.name);
  return imageTypes.includes(extension);
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// URL helpers
export const getFormShareUrl = (formId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/form/${formId}`;
};

export const getFormPreviewUrl = (formId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/form/${formId}/preview`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Form analytics helpers
export const calculateCompletionRate = (totalViews, totalSubmissions) => {
  if (!totalViews || totalViews === 0) return 0;
  return Math.round((totalSubmissions / totalViews) * 100);
};

export const calculatePercentage = (value, total) => {
  return total === 0 ? 0 : Math.round((value / total) * 100);
};

export const getAverageCompletionTime = (responses) => {
  if (!responses || responses.length === 0) return 0;
  
  const completionTimes = responses
    .filter(response => response.completionTime)
    .map(response => response.completionTime);
    
  if (completionTimes.length === 0) return 0;
  
  const total = completionTimes.reduce((sum, time) => sum + time, 0);
  return Math.round(total / completionTimes.length);
};

// Question type helpers
export const getQuestionTypeIcon = (type) => {
  const icons = {
    text: '📝',
    categorize: '📂',
    cloze: '✏️',
    comprehension: '📖',
    'multiple-choice': '☑️',
    'single-choice': '🔘'
  };
  return icons[type] || '❓';
};

export const getQuestionTypeLabel = (type) => {
  const labels = {
    text: 'Text Response',
    categorize: 'Categorize',
    cloze: 'Fill in the Blanks',
    comprehension: 'Reading Comprehension',
    'multiple-choice': 'Multiple Choice',
    'single-choice': 'Single Choice'
  };
  return labels[type] || 'Unknown';
};

// Local storage helpers
export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Theme helpers
export const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// Error handling helpers
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

// Export all helpers as default
export default {
  validateForm,
  validateQuestion,
  validateResponse,
  formatDate,
  formatDateTime,
  getTimeAgo,
  formatDuration,
  truncateText,
  capitalizeFirst,
  slugify,
  moveArrayItem,
  removeArrayItem,
  addArrayItem,
  deepClone,
  isEmpty,
  getFileExtension,
  isImageFile,
  formatFileSize,
  getFormShareUrl,
  getFormPreviewUrl,
  copyToClipboard,
  calculateCompletionRate,
  calculatePercentage,
  getAverageCompletionTime,
  getQuestionTypeIcon,
  getQuestionTypeLabel,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  getSystemTheme,
  applyTheme,
  getErrorMessage,
  isNetworkError
};