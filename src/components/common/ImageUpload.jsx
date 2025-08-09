import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';

const ImageUpload = ({ 
  onImageUpload, 
  currentImage = null, 
  className = '', 
  placeholder = 'Upload Image',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024 // 5MB default
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > maxSize) {
      alert(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);

      // You can implement actual upload to server here
      // For now, we'll create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      
      if (onImageUpload) {
        onImageUpload(imageUrl, file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    if (onImageUpload) {
      onImageUpload(null, null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
            <button
              onClick={openFileDialog}
              className="bg-white text-gray-800 px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {uploading ? 'Uploading...' : placeholder}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Drag and drop or click to select
            </p>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;