import React, { useState } from 'react';
import { Studio } from './types';
import Header from './components/Header';
import RealEstateStudio from './studios/RealEstateStudio';
import FashionModelStudio from './studios/FashionModelStudio';
import RestaurantStudio from './studios/RestaurantStudio';
import BeautyAdStudio from './studios/BeautyAdStudio';
import SpotlightCard from './components/SpotlightCard';
import GalleryPage from './pages/GalleryPage';

const HouseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const FashionIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 4l6 2v5h-3v8a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l6 -2a3 3 0 0 0 6 0" />
  </svg>
);

const RestaurantIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const BeautyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3 1m3-1v-6.205m0 0l1.5-.545M7.5 3l3.75 1.364M7.5 3v6.205m0 0l3 1m-3-1l-3 1" />
  </svg>
);


// StudioCard component for the selection screen
interface StudioCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  spotlightColor: `rgba(${number}, ${number}, ${number}, ${number})`;
  onClick: () => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ icon, title, description, spotlightColor, onClick }) => (
  <SpotlightCard
    onClick={onClick}
    spotlightColor={spotlightColor}
    className="p-8 rounded-3xl bg-brand-dark-light border border-brand-dark-lighter cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-gray-600 flex flex-col text-left h-full"
  >
    <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-300 mb-6 flex-grow">{description}</p>
    <div className="font-semibold text-white group flex items-center">
      Get Started <span className="transform transition-transform duration-300 group-hover:translate-x-2 ml-2">&rarr;</span>
    </div>
  </SpotlightCard>
);

// StudioSelection component
interface StudioSelectionProps {
  onSelectStudio: (studio: Studio) => void;
}

const StudioSelection: React.FC<StudioSelectionProps> = ({ onSelectStudio }) => (
  <div className="text-center animate-fade-in">
    <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 text-white">Choose Your Creative Studio</h2>
    <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">Select a specialized AI studio to transform your creative vision.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <StudioCard
        icon={<HouseIcon />}
        title="Real Estate Virtual Staging"
        description="Transform empty spaces into beautifully furnished rooms using AI."
        spotlightColor="rgba(56, 189, 248, 0.15)" // cyan-400
        onClick={() => onSelectStudio(Studio.RealEstate)}
      />
      <StudioCard
        icon={<FashionIcon />}
        title="Fashion Virtual Clothing"
        description="Try on virtual outfits and see clothing designs on models."
        spotlightColor="rgba(244, 63, 94, 0.15)" // rose-500
        onClick={() => onSelectStudio(Studio.Fashion)}
      />
       <StudioCard
        icon={<RestaurantIcon />}
        title="Restaurant Menu Visualizer"
        description="Create appetizing food imagery for menu items from a description."
        spotlightColor="rgba(245, 158, 11, 0.15)" // amber-500
        onClick={() => onSelectStudio(Studio.Restaurant)}
      />
      <StudioCard
        icon={<BeautyIcon />}
        title="Marketing Agency: Beauty Ads"
        description="Generate stunning ad images for beauty and cosmetic products in any scene."
        spotlightColor="rgba(217, 70, 239, 0.15)" // fuchsia-500
        onClick={() => onSelectStudio(Studio.Beauty)}
      />
    </div>
  </div>
);


const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'selection' | 'studio' | 'gallery'>('selection');
  const [activeStudio, setActiveStudio] = useState<Studio | null>(null);

  const renderStudio = () => {
    switch (activeStudio) {
      case Studio.RealEstate:
        return <RealEstateStudio />;
      case Studio.Fashion:
        return <FashionModelStudio />;
      case Studio.Restaurant:
        return <RestaurantStudio />;
      case Studio.Beauty:
        return <BeautyAdStudio />;
      default:
        return null;
    }
  };
  
  const handleSelectStudio = (studio: Studio) => {
    setActiveStudio(studio);
    setCurrentView('studio');
  };

  const handleNavigateHome = () => {
      setActiveStudio(null);
      setCurrentView('selection');
  };

  const handleNavigateToGallery = () => {
      setActiveStudio(null);
      setCurrentView('gallery');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'selection':
        return <StudioSelection onSelectStudio={handleSelectStudio} />;
      case 'studio':
        return <div className="animate-fade-in">{renderStudio()}</div>;
      case 'gallery':
        return <GalleryPage />;
      default:
        return <StudioSelection onSelectStudio={handleSelectStudio} />;
    }
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Header 
        onNavigateHome={handleNavigateHome} 
        onNavigateToGallery={handleNavigateToGallery}
        activeStudio={currentView === 'studio' ? activeStudio : null} 
      />
      <main className="container mx-auto px-4 py-12 sm:py-20">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default MainApp;