import React from 'react';

const SongCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse dark:bg-neutral-800">
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 dark:bg-neutral-700"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 dark:bg-neutral-700"></div>
        <div className="h-40 bg-gray-200 rounded mb-4 dark:bg-neutral-700"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2 dark:bg-neutral-700"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 dark:bg-neutral-700"></div>
      </div>
    </div>
  );
};

export default SongCardSkeleton;
