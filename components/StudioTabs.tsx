
import React from 'react';
import { Studio } from '../types';

interface StudioTabsProps {
  activeStudio: Studio;
  setActiveStudio: (studio: Studio) => void;
}

const StudioTabs: React.FC<StudioTabsProps> = ({ activeStudio, setActiveStudio }) => {
  const studios = Object.values(Studio);

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 p-2 bg-brand-dark-light rounded-full shadow-lg">
      {studios.map((studio) => (
        <button
          key={studio}
          onClick={() => setActiveStudio(studio)}
          className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark-light focus:ring-brand-purple ${
            activeStudio === studio
              ? 'bg-brand-purple text-white shadow-md'
              : 'text-gray-300 hover:bg-brand-dark-lighter hover:text-white'
          }`}
        >
          {studio}
        </button>
      ))}
    </div>
  );
};

export default StudioTabs;
