import React from 'react';
import loadinggif from '../assets/loading.gif';

const Loading = ({ loadingText = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-opacity-70">
      <img src={loadinggif} alt="Loading..." className="w-52 mb-4" />
      
      {/* ✅ Loading text */}
      <p className="relative bottom-12 text-gray-700 text-lg font-medium animate-pulse">
        {loadingText}
      </p>
    </div>
  );
};

export default Loading;
