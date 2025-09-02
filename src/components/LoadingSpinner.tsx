import React from 'react';
import { Coffee } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <Coffee className="w-12 h-12 text-orange-600 mx-auto" />
        </div>
        <p className="text-gray-600 font-medium">Loading menu...</p>
      </div>
    </div>
  );
};