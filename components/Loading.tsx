import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
      <Loader2 className="w-12 h-12 animate-spin text-[#EF5350] mb-4" />
      <p className="text-lg font-bold tracking-wide text-gray-400">LOADING...</p>
    </div>
  );
};

export default Loading;