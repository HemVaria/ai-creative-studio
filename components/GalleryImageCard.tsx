import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Calendar } from 'lucide-react';

interface GalleryImageCardProps {
  image: GeneratedImage;
}

const studioColors: { [key: string]: string } = {
  'Real Estate': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Fashion': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Restaurant': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Beauty': 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
};

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({ image }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative aspect-square rounded-3xl overflow-hidden group border border-white/10 bg-zinc-900">
      <img 
        src={image.image_url} 
        alt={image.prompt} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-md ${studioColors[image.studio] || 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'}`}>
                {image.studio}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar className="w-3 h-3" />
              {formatDate(image.created_at)}
            </div>
          </div>
          
          <p className="text-sm font-medium text-white line-clamp-2 leading-relaxed mb-4" title={image.prompt}>
            {image.prompt}
          </p>
          
          <a
            href={image.image_url}
            download={`creative-studio-${image.id}.png`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors"
          >
            <Download className="w-3 h-3" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default GalleryImageCard;