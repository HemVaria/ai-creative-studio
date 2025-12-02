"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import AnimatedGenerateButton from '../components/AnimatedGenerateButton';
import Spinner from '../components/Spinner';
import SpotlightCard from '../components/SpotlightCard';
import { generateVirtualTryOnImageAction, enhancePromptAction } from '../app/actions';
import EnhancePromptButton from '../components/EnhancePromptButton';
import { useAuth } from '../contexts/AuthContext';
import { uploadAndSaveGeneration } from '../services/supabaseService';
import { Studio } from '../types';
import { Download, Sparkles, Image as ImageIcon, Upload, Check } from 'lucide-react';

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
    <div className="mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>}
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
      className="group relative w-full h-full min-h-[300px] bg-black/30 border border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-pink-500/50 hover:bg-white/5 transition-all duration-300 overflow-hidden"
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
            <img src={imagePreview} alt="Model preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-6 py-2 rounded-xl bg-white text-black font-semibold text-sm">Change image</div>
            </div>
        </>
      ) : (
        <div className="relative z-10 flex flex-col items-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-pink-500/30">
                <Upload className="w-8 h-8 text-zinc-400 group-hover:text-pink-400 transition-colors" />
            </div>
            <p className="font-semibold text-white mb-1">Drop model photo</p>
            <p className="text-sm text-zinc-400 mb-4">Full-body or portrait</p>
            <div className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-white/10 border border-white/10 group-hover:bg-white/20 group-hover:border-white/20 transition-all">
                Select Image
            </div>
        </div>
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
      const enhanced = await enhancePromptAction(customPrompt);
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
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('style', styleToGenerate);
      const result = await generateVirtualTryOnImageAction(formData);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <SectionHeader title="Upload Model" subtitle="Full-body or portrait photo for virtual try-on" />
                <div className="mt-4 h-80">
                    <FashionImageInput 
                        onImageSelect={handleImageSelect}
                        imagePreview={imagePreview}
                    />
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <SectionHeader title="Clothing Style" subtitle="Choose an outfit to try on" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {CLOTHING_STYLES.map(style => (
                        <SpotlightCard
                            key={style.name}
                            onClick={() => setSelectedStyle(style.name)}
                            spotlightColor="rgba(244, 63, 94, 0.15)"
                            className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                                selectedStyle === style.name
                                    ? 'bg-pink-500/20 border-pink-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                                    : 'bg-black/40 border-white/5 hover:bg-white/5'
                            }`}
                        >
                             <div className="flex justify-between items-start mb-1">
                                <p className={`font-bold ${selectedStyle === style.name ? 'text-white' : 'text-zinc-300'}`}>{style.name}</p>
                                {selectedStyle === style.name && (
                                    <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500 line-clamp-1">
                                {style.description}
                            </p>
                        </SpotlightCard>
                    ))}
                </div>
                
                {selectedStyle === 'Custom' && (
                    <div className="mt-4 animate-fade-in relative">
                        <textarea
                            rows={3}
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="e.g., a futuristic silver jacket with neon green stripes..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all resize-none"
                        />
                        <div className="absolute bottom-3 right-3">
                            <EnhancePromptButton onClick={handleEnhancePrompt} isLoading={isEnhancing} disabled={!customPrompt || isLoading} />
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-2 space-y-4">
                <AnimatedGenerateButton 
                    onClick={handleGenerate} 
                    disabled={isGenerateDisabled} 
                    isGenerating={isLoading}
                    text={isLoading ? 'Generating Look...' : 'Generate Outfit'}
                />
                {error && <p className="text-red-400 mt-2 text-center text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
            </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7">
            <div className="sticky top-24 bg-zinc-900/50 border border-white/10 rounded-3xl p-2 backdrop-blur-sm h-[calc(100vh-8rem)] flex flex-col">
                <div className="flex-1 bg-black/50 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                    {/* Grid Pattern Background */}
                    <div className="absolute inset-0 opacity-20" 
                        style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            displayImage ? (
                                <img src={displayImage} alt="Model with clothing" className="rounded-lg shadow-2xl max-w-full max-h-full object-contain" />
                            ) : (
                                <div className="text-center text-zinc-500">
                                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-sm font-medium">Upload a model and select a style</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                
                {generatedImage && (
                    <div className="p-4">
                        <button 
                            onClick={handleDownload}
                            className="flex items-center justify-center w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-zinc-200 transition-colors gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default FashionModelStudio;