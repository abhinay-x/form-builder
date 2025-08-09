import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  fullScreen = false,
  overlay = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const LoadingContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <LoadingContent />
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-40">
        <LoadingContent />
      </div>
    );
  }

  return <LoadingContent />;
};

// Skeleton loading component for content placeholders
export const SkeletonLoader = ({ className = '', lines = 3, height = 'h-4' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 dark:bg-gray-700 rounded ${height} ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Card skeleton for form cards
export const FormCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );
};

// Button loading state
export const ButtonLoading = ({ children, loading = false, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      <div className="flex items-center justify-center space-x-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Loading;