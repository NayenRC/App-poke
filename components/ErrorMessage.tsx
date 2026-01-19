import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="w-12 h-12 text-[#EF5350]" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
      <p className="text-gray-500 mb-6 max-w-md font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-8 py-3 bg-[#EF5350] text-white rounded-xl hover:bg-red-600 transition-colors font-bold shadow-lg shadow-red-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;