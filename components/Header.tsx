import React from 'react';
import { Studio } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    onNavigateHome: () => void;
    onNavigateToGallery: () => void;
    activeStudio: Studio | null;
}

const studioConfig = {
    [Studio.RealEstate]: { icon: 'RE', name: 'Real Estate Staging', color: 'bg-blue-500' },
    [Studio.Fashion]: { icon: 'FV', name: 'Fashion Virtual', color: 'bg-pink-500' },
    [Studio.Restaurant]: { icon: 'MN', name: 'Menu Visualizer', color: 'bg-amber-500' },
    [Studio.Beauty]: { icon: 'BA', name: 'Marketing Agency: Beauty Ads', color: 'bg-fuchsia-500' },
};


const Header: React.FC<HeaderProps> = ({ onNavigateHome, onNavigateToGallery, activeStudio }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="py-6 px-4 sm:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {activeStudio ? (
            <div className="flex items-center space-x-4">
                <button onClick={onNavigateHome} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-300">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <span>Back</span>
                </button>
                <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white ${studioConfig[activeStudio].color}`}>
                        {studioConfig[activeStudio].icon}
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        {studioConfig[activeStudio].name}
                    </h1>
                </div>
            </div>
        ) : (
            <div onClick={onNavigateHome} className="flex items-center space-x-3 cursor-pointer group">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    AI
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    Creative Studio
                </h1>
            </div>
        )}
        <div className="flex items-center space-x-6">
            <button onClick={onNavigateToGallery} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                My Gallery
            </button>
            <div className="flex items-center space-x-4">
              {user && <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>}
              <button onClick={signOut} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Logout
              </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;