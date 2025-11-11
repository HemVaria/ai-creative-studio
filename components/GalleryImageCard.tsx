import React from 'react';
import { GeneratedImage } from '../types';

interface GalleryImageCardProps {
  image: GeneratedImage;
}

const studioColors: { [key: string]: string } = {
  'Real Estate': 'bg-cyan-500/80',
  'Fashion': 'bg-rose-500/80',
  'Restaurant': 'bg-amber-500/80',
  'Beauty': 'bg-fuchsia-500/80',
};

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({ image }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg animate-fade-in">
      <img src={image.image_url} alt={image.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-semibold text-white line-clamp-3 leading-tight" title={image.prompt}>
            {image.prompt}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${studioColors[image.studio] || 'bg-gray-500'}`}>
                {image.studio}
            </span>
            <span className="text-xs text-gray-300">{formatDate(image.created_at)}</span>
          </div>
        </div>
      </div>

      <a
        href={image.image_url}
        download={`creative-studio-${image.id}.png`}
        title="Download Image"
        className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 hover:bg-brand-purple"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </a>
    </div>
  );
};

export default GalleryImageCard;