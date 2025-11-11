import React, { useRef } from 'react';

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
      className="w-full p-8 border-2 border-dashed border-brand-dark-lighter rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-purple hover:bg-brand-dark-light/30 transition-colors duration-300 min-h-[250px] sm:min-h-[300px]"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      <div className="bg-brand-dark-light rounded-full p-4 mb-4">
        <svg className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p className="font-semibold text-white mb-1">{title}</p>
      <p className="text-sm text-gray-400 mb-4">{description}</p>
      <div className="px-5 py-2 border border-gray-600 rounded-lg text-sm font-semibold text-gray-300 bg-brand-dark-light hover:bg-gray-700 transition-colors">
        Choose Image
      </div>
    </div>
  );
};

export default ImageInput;
