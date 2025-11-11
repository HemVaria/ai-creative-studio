import React, { useState, useCallback } from 'react';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import SpotlightCard from '../components/SpotlightCard';
import { generateFoodImage, enhancePrompt } from '../services/geminiService';
import EnhancePromptButton from '../components/EnhancePromptButton';
import { useAuth } from '../contexts/AuthContext';
import { uploadAndSaveGeneration } from '../services/supabaseService';
import { Studio } from '../types';

const FOOD_STYLES = ['Studio Lighting', 'Dark & Moody', 'Cafe Setting', 'Gourmet Plating', 'Rustic', 'Vibrant & Colorful'];

const SectionHeader: React.FC<{title: string, subtitle?: string}> = ({title, subtitle}) => (
    <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
);

const PreviewPlaceholder: React.FC<{text: string}> = ({text}) => (
    <div className="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        </svg>
        <p className="mt-2 text-sm">{text}</p>
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
      const enhanced = await enhancePrompt(prompt);
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
      const result = await generateFoodImage(prompt, selectedStyle);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left Column: Inputs */}
      <div className="space-y-8">
        <div>
          <SectionHeader title="Describe Your Dish" subtitle="Be descriptive for the best results. E.g., 'A juicy cheeseburger with melted cheddar...'" />
          <div className="mt-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the food item here..."
              className="w-full h-32 bg-brand-dark-light border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
            />
            <EnhancePromptButton onClick={handleEnhancePrompt} isLoading={isEnhancing} disabled={!prompt || isLoading} />
          </div>
        </div>
        
        <div>
          <SectionHeader title="Select a Photographic Style" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {FOOD_STYLES.map(style => (
              <SpotlightCard
                key={style}
                onClick={() => setSelectedStyle(style)}
                spotlightColor="rgba(245, 158, 11, 0.2)"
                className={`p-3 text-center rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                  selectedStyle === style 
                    ? 'bg-amber-500 text-white ring-2 ring-offset-2 ring-offset-black ring-amber-600' 
                    : 'bg-brand-dark-light text-gray-300'
                }`}
              >
                {style}
              </SpotlightCard>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleGenerate} disabled={!isFormValid || isLoading} isLoading={isLoading}>
            Generate Food Image
          </Button>
        </div>
        {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
      </div>

      {/* Right Column: Output */}
      <div>
        <SectionHeader title="Generated Menu Image" />
        <div className="mt-4 w-full aspect-[4/3] bg-black border-2 border-dashed border-brand-dark-lighter rounded-2xl flex items-center justify-center p-2">
            <div className="w-full h-full flex items-center justify-center">
                {isLoading ? <Spinner /> : (
                    generatedImage ? (
                        <img src={generatedImage} alt="Generated food" className="rounded-lg shadow-lg max-w-full max-h-full object-contain" />
                    ) : (
                        <PreviewPlaceholder text="Your generated food image will appear here" />
                    )
                )}
            </div>
        </div>
        {generatedImage && (
             <a 
              href={generatedImage} 
              download={`menu-item-${prompt.substring(0,20).replace(/\s/g, '_')}.jpg`}
              className="mt-6 block w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors"
            >
              Download Image
            </a>
        )}
      </div>
    </div>
  );
};

export default RestaurantStudio;