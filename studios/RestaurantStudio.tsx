"use client";

import React, { useState, useCallback } from 'react';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import SpotlightCard from '../components/SpotlightCard';
import { generateFoodImageAction, enhancePromptAction } from '../app/actions';
import EnhancePromptButton from '../components/EnhancePromptButton';
import { useAuth } from '../contexts/AuthContext';
import { uploadAndSaveGeneration } from '../services/supabaseService';
import { Studio } from '../types';
import { Download, Sparkles, Image as ImageIcon } from 'lucide-react';

const FOOD_STYLES = ['Studio Lighting', 'Dark & Moody', 'Cafe Setting', 'Gourmet Plating', 'Rustic', 'Vibrant & Colorful'];

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

const RestaurantStudio: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>(FOOD_STYLES[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const apiKey = localStorage.getItem('google_api_key') || undefined;
      const enhanced = await enhancePromptAction(prompt, apiKey);
      setPrompt(enhanced);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while enhancing prompt.');
    } finally {
      setIsEnhancing(false);
    }
  }, [prompt]);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please describe the food item.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const apiKey = localStorage.getItem('google_api_key') || undefined;
      const result = await generateFoodImageAction(prompt, selectedStyle, apiKey);
      setGeneratedImage(`data:image/jpeg;base64,${result}`);

      if (user) {
        try {
          await uploadAndSaveGeneration(
            result,
            'image/jpeg',
            user.id,
            prompt,
            selectedStyle,
            Studio.Restaurant
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
  }, [prompt, selectedStyle, user]);

  const isFormValid = !!prompt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <SectionHeader title="Describe Dish" subtitle="Be descriptive for the best results. E.g., 'A juicy cheeseburger with melted cheddar...'" />
          <div className="mt-4 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the food item here..."
              className="w-full h-40 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
            />
            <div className="absolute bottom-3 right-3">
                <EnhancePromptButton onClick={handleEnhancePrompt} isLoading={isEnhancing} disabled={!prompt || isLoading} />
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <SectionHeader title="Photo Style" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {FOOD_STYLES.map(style => (
              <SpotlightCard
                key={style}
                onClick={() => setSelectedStyle(style)}
                spotlightColor="rgba(245, 158, 11, 0.2)"
                className={`p-3 text-center rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  selectedStyle === style 
                    ? 'bg-amber-500/20 border-amber-500/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {style}
              </SpotlightCard>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleGenerate} disabled={!isFormValid || isLoading} isLoading={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Food Image
          </Button>
        </div>
        {error && <p className="text-red-400 mt-2 text-center text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
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
                        generatedImage ? (
                            <img src={generatedImage} alt="Generated food" className="rounded-lg shadow-2xl max-w-full max-h-full object-contain" />
                        ) : (
                            <PreviewPlaceholder text="Your generated food image will appear here" />
                        )
                    )}
                </div>
            </div>
            
            {generatedImage && (
                <div className="p-4">
                    <a 
                    href={generatedImage} 
                    download={`menu-item-${prompt.substring(0,20).replace(/\s/g, '_')}.jpg`}
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

export default RestaurantStudio;