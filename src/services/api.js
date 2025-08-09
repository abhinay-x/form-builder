import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5052/api',
  timeout: 30000,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  },
});

// Public API instance (no auth required)
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5052/api',
  timeout: 30000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Forms API
export const formsAPI = {
  // Get all forms
  getForms: () => api.get('/forms'),
  
  // Get form by ID
  getForm: (id) => api.get(`/forms/${id}`),
  
  // Get form for preview
  getFormPreview: (id) => api.get(`/forms/${id}/preview`),
  
  // Create new form
  createForm: (formData) => api.post('/forms', formData),
  
  // Update form
  updateForm: (id, formData) => api.put(`/forms/${id}`, formData),
  
  // Delete form
  deleteForm: (id) => api.delete(`/forms/${id}`),
  
  // Publish/unpublish form
  publishForm: (id, isPublished) => api.post(`/forms/${id}/publish`, { isPublished }),
  
  // Duplicate form
  duplicateForm: (id) => api.post(`/forms/duplicate/${id}`),
  
  // Upload image
  uploadImage: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/forms/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Responses API
export const responsesAPI = {
  // Use correct endpoint for submissions
  createResponse: (data) => publicApi.post('/responses', data),
  
  // Keep other methods as-is
  getResponses: () => api.get('/responses'),
  getFormResponses: (formId) => api.get(`/responses/form/${formId}`),
  getResponse: (id) => api.get(`/responses/${id}`),
  updateResponse: (id, responseData) => api.put(`/responses/${id}`, responseData),
  deleteResponse: (id) => api.delete(`/responses/${id}`),
  getFormAnalytics: (formId) => api.get(`/responses/analytics/${formId}`)
};

// Helper functions
export const apiHelpers = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || error.response.data?.error || 'Server error',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        status: 0,
        data: null,
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null,
      };
    }
  },

  // Create form data for file upload
  createFormData: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  },

  // Convert image file to base64
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  // Get full image URL
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5052'}${imagePath}`;
  },
};

// Export default api instance
export default api;