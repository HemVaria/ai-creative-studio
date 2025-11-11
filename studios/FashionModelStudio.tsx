import React, { useState, useCallback, useEffect, useRef } from 'react';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import SpotlightCard from '../components/SpotlightCard';
import { generateVirtualTryOnImage, enhancePrompt } from '../services/geminiService';
import EnhancePromptButton from '../components/EnhancePromptButton';
import { useAuth } from '../contexts/AuthContext';
import { uploadAndSaveGeneration } from '../services/supabaseService';
import { Studio } from '../types';

const CLOTHING_STYLES = [
  { name: 'Casual', description: 'Relaxed everyday wear' },
  { name: 'Formal', description: 'Elegant dress clothes' },
  { name: 'Streetwear', description: 'Urban contemporary style' },
  { name: 'Sports', description: 'Sports and fitness wear' },
  { name: 'Evening', description: 'Sophisticated gala outfits' },
  { name: 'Resort', description: 'Vacation and beach wear' },
  { name: 'Custom', description: 'Describe your own style' },
];

const SectionHeader: React.FC<{title: string, subtitle?: string}> = ({title, subtitle}) => (
    <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
);

const FashionImageInput: React.FC<{ onImageSelect: (file: File) => void; imagePreview: string | null; }> = ({ onImageSelect, imagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };
  const handleAreaClick = () => fileInputRef.current?.click();

  return (
    <div
      onClick={handleAreaClick}
      className="bg-brand-dark-light border-2 border-dashed border-brand-dark-lighter rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer h-full transition-all duration-300 hover:border-pink-500/70 relative overflow-hidden group"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      {imagePreview ? (
        <>
            <img src={imagePreview} alt="Model preview" className="absolute inset-0 w-full h-full object-cover rounded-3xl" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl">
                <div className="text-white font-semibold text-lg">Change image</div>
            </div>
        </>
      ) : (
        <>
            <div className="bg-brand-dark rounded-full p-4 mb-4">
                <svg className="w-8 h-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </div>
            <p className="font-semibold text-gray-300 mb-1">Drop your model photo here</p>
            <p className="text-sm text-gray-400 mb-4">Full-body or portrait in good lighting</p>
            <div className="mt-2 px-6 py-2.5 bg-black rounded-lg text-sm font-semibold text-white hover:bg-gray-800 transition-colors">
                Choose Image
            </div>
        </>
      )}
    </div>
  );
};


const FashionModelStudio: React.FC = () => {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('Sports');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setGeneratedImage(null);
    setImagePreview(URL.createObjectURL(file));
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleEnhancePrompt = useCallback(async () => {
    if (!customPrompt) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const enhanced = await enhancePrompt(customPrompt);
      setCustomPrompt(enhanced);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while enhancing prompt.');
    } finally {
      setIsEnhancing(false);
    }
  }, [customPrompt]);


  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload a model image first.');
      return;
    }

    const styleToGenerate = selectedStyle === 'Custom' ? customPrompt : selectedStyle;
    if (!styleToGenerate.trim()) {
      setError('Please select a style or enter a custom prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateVirtualTryOnImage(imageFile, styleToGenerate);
      setGeneratedImage(`data:image/png;base64,${result}`);

      if (user) {
        try {
          await uploadAndSaveGeneration(
            result,
            'image/png',
            user.id,
            styleToGenerate,
            selectedStyle,
            Studio.Fashion
          );
        } catch (saveError) {
          console.error("Failed to save image to gallery:", saveError);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, selectedStyle, customPrompt, user]);

  const displayImage = generatedImage || imagePreview;
  
  const handleDownload = () => {
      if (generatedImage) {
        const styleForFilename = selectedStyle === 'Custom' ? customPrompt : selectedStyle;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `virtual-try-on-${styleForFilename.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  }

  const isGenerateDisabled = !imageFile || isLoading || (selectedStyle === 'Custom' && !customPrompt.trim());

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,1fr,1.2fr] gap-10">
            {/* Column 1: Upload Model */}
            <div className="flex flex-col">
                <SectionHeader title="Upload Model" subtitle="Full-body or portrait photo for virtual try-on" />
                <div className="flex-grow">
                    <FashionImageInput 
                        onImageSelect={handleImageSelect}
                        imagePreview={imagePreview}
                    />
                </div>
            </div>

            {/* Column 2: Clothing Styles */}
            <div>
                <SectionHeader title="Clothing Styles" subtitle="Choose an outfit to try on" />
                <div className="grid grid-cols-2 gap-4">
                    {CLOTHING_STYLES.map(style => (
                        <SpotlightCard
                            key={style.name}
                            onClick={() => setSelectedStyle(style.name)}
                            spotlightColor="rgba(244, 63, 94, 0.15)"
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                                selectedStyle === style.name
                                    ? 'bg-brand-purple/20 border-brand-purple ring-2 ring-offset-2 ring-offset-black ring-brand-purple'
                                    : 'bg-brand-dark-light border-brand-dark-lighter'
                            }`}
                        >
                             <div className="flex justify-between items-start">
                                <p className="font-bold text-white pr-2">{style.name}</p>
                                <div className={`mt-1 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                    selectedStyle === style.name
                                        ? 'bg-brand-purple border-brand-purple'
                                        : 'border-gray-500'
                                }`}>
                                    {selectedStyle === style.name && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-white">
                                            <path d="M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <p className={`text-sm mt-2 ${selectedStyle === style.name ? 'text-purple-200' : 'text-gray-400'}`}>
                                {style.description}
                            </p>
                        </SpotlightCard>
                    ))}
                    {selectedStyle === 'Custom' && (
                        <div className="col-span-2 mt-2 animate-fade-in">
                            <label htmlFor="custom-style-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                                Describe the clothing style
                            </label>
                            <textarea
                                id="custom-style-prompt"
                                rows={3}
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="e.g., a futuristic silver jacket with neon green stripes..."
                                className="w-full bg-brand-dark-light border-2 border-brand-dark-lighter rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-colors"
                            />
                            <EnhancePromptButton onClick={handleEnhancePrompt} isLoading={isEnhancing} disabled={!customPrompt || isLoading} />
                        </div>
                    )}
                </div>
            </div>

            {/* Column 3: Output */}
            <div className="xl:col-span-1">
                <SectionHeader title="Output" />
                <div className="w-full aspect-[3/4] bg-white/5 rounded-2xl flex flex-col overflow-hidden shadow-lg border border-gray-700">
                    <div className="flex-grow bg-black flex items-center justify-center relative">
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            displayImage ? (
                                <img src={displayImage} alt="Model with clothing" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-center text-gray-700 p-4">
                                   <p>Upload a model and select a style to generate an image.</p>
                                </div>
                            )
                        )}
                    </div>
                    <div className="bg-gray-200/5 backdrop-blur-sm border-t border-gray-700 p-2 flex justify-end items-center">
                        <button 
                            onClick={handleDownload}
                            disabled={!generatedImage || isLoading}
                            className="text-blue-400 p-2 rounded-full hover:bg-white/10 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            aria-label="Download Image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-4 max-w-lg mx-auto">
          <Button onClick={handleGenerate} disabled={isGenerateDisabled} isLoading={isLoading}>
            {isLoading ? 'Generating Your New Look...' : 'Generate Outfit'}
          </Button>
          {error && <p className="text-red-400 mt-4 text-center text-sm">{error}</p>}
        </div>
    </div>
  );
};

export default FashionModelStudio;