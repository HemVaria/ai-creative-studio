import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageInputProps {
  onImageSelect: (file: File) => void;
  title: string;
  description: string;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageSelect, title, description }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleAreaClick}
      className="group relative w-full p-8 border border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 min-h-[250px] sm:min-h-[300px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-purple-500/30">
          <Upload className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 transition-colors" />
        </div>
        
        <p className="font-semibold text-white text-lg mb-2">{title}</p>
        <p className="text-sm text-zinc-400 mb-6 max-w-xs">{description}</p>
        
        <div className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-white/10 border border-white/10 group-hover:bg-white/20 group-hover:border-white/20 transition-all">
          Select Image
        </div>
      </div>
    </div>
  );
};

export default ImageInput;
