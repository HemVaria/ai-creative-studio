"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ImageInput from '../components/ImageInput';
import AnimatedGenerateButton from '../components/AnimatedGenerateButton';
import Spinner from '../components/Spinner';
import SpotlightCard from '../components/SpotlightCard';
import { stageRealEstateImageAction } from '../app/actions';
import { useAuth } from '../contexts/AuthContext';
import { uploadAndSaveGeneration } from '../services/supabaseService';
import { Studio } from '../types';
import { Download, Sparkles, Image as ImageIcon } from 'lucide-react';

const STAGING_STYLES = ['Modern', 'Luxury', 'Cozy', 'Industrial', 'Minimalist', 'Bohemian'];

const SectionHeader: React.FC<{title: string, subtitle?: string}> = ({title, subtitle}) => (
    <div className="mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>}
    </div>
);

const PreviewPlaceholder: React.FC<{text: string}> = ({text}) => (
    <div className="text-center text-zinc-500">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-sm font-medium">{text}</p>
    </div>
);

const RealEstateStudio: React.FC = () => {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(STAGING_STYLES[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('style', selectedStyle);
      
      const apiKey = localStorage.getItem('google_api_key');
      if (apiKey) {
        formData.append('apiKey', apiKey);
      }

      const result = await stageRealEstateImageAction(formData);
      setGeneratedImage(`data:image/png;base64,${result}`);

      if (user) {
        try {
          await uploadAndSaveGeneration(
            result,
            'image/png',
            user.id,
            'Virtual Staging of an empty room.',
            selectedStyle,
            Studio.RealEstate
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
  }, [imageFile, selectedStyle, user]);
  
  const displayImage = generatedImage || imagePreview;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <SectionHeader title="Upload Room" subtitle="Start with an empty or partially furnished room" />
          <div className="mt-4">
             <ImageInput 
                onImageSelect={handleImageSelect}
                title="Drop room image"
                description="or click to browse"
            />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <SectionHeader title="Staging Style" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {STAGING_STYLES.map(style => (
              <SpotlightCard
                key={style}
                onClick={() => setSelectedStyle(style)}
                spotlightColor="rgba(59, 130, 246, 0.15)"
                className={`p-3 text-center rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  selectedStyle === style 
                    ? 'bg-blue-500/20 border-blue-500/50 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {style}
              </SpotlightCard>
            ))}
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <AnimatedGenerateButton 
            onClick={handleGenerate} 
            disabled={!imageFile || isLoading} 
            isGenerating={isLoading}
            text="Generate Staged Image"
          />
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
                    {isLoading ? <Spinner /> : (
                        displayImage ? (
                            <img src={displayImage} alt="Room preview" className="rounded-lg shadow-2xl max-w-full max-h-full object-contain" />
                        ) : (
                            <PreviewPlaceholder text="Upload an image to get started" />
                        )
                    )}
                </div>
            </div>
            
            {generatedImage && (
                <div className="p-4">
                    <a 
                    href={generatedImage} 
                    download={`staged-room-${selectedStyle.toLowerCase()}.png`}
                    className="flex items-center justify-center w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-zinc-200 transition-colors gap-2"
                    >
                    <Download className="w-5 h-5" />
                    Download Image
                    </a>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RealEstateStudio;
