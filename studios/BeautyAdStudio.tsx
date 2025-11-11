import React, { useState, useCallback, useEffect } from 'react';
import ImageInput from '../components/ImageInput';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import SpotlightCard from '../components/SpotlightCard';
import { generateBeautyAdImage, enhancePrompt } from '../services/geminiService';
import EnhancePromptButton from '../components/EnhancePromptButton';
import { useAuth } from '../contexts/AuthContext';
import { uploadAndSaveGeneration } from '../services/supabaseService';
import { Studio } from '../types';

const AD_STYLES = ['Minimalist', 'Natural', 'Lush', 'Geometric', 'Abstract', 'Aquatic'];

const SectionHeader: React.FC<{title: string, subtitle?: string}> = ({title, subtitle}) => (
    <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
);

const PreviewPlaceholder: React.FC<{text: string}> = ({text}) => (
    <div className="text-center text-gray-500">
        <svg className="w-16 h-16 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p className="mt-2 text-sm">{text}</p>
    </div>
);

const BeautyAdStudio: React.FC = () => {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>(AD_STYLES[0]);
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
    if (!imageFile || !prompt) {
      setError('Please upload a product image and describe the scene.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateBeautyAdImage(imageFile, prompt, selectedStyle);
      setGeneratedImage(`data:image/png;base64,${result}`);

      if (user) {
        try {
          await uploadAndSaveGeneration(
            result,
            'image/png',
            user.id,
            prompt,
            selectedStyle,
            Studio.Beauty
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
  }, [imageFile, prompt, selectedStyle, user]);
  
  const displayImage = generatedImage || imagePreview;
  const isFormValid = !!imageFile && !!prompt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left Column: Inputs */}
      <div className="space-y-8">
        <div>
          <SectionHeader title="Upload Product Image" subtitle="Use a clean product shot, ideally on a transparent background (PNG)." />
          <div className="mt-4">
             <ImageInput 
                onImageSelect={handleImageSelect}
                title="Drop your product image here"
                description="or click to browse from your device"
            />
          </div>
        </div>

        <div>
            <SectionHeader title="Describe Ad Scene" subtitle="E.g., 'On a black volcanic rock with water splashing.'" />
            <div className="mt-4">
                <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the desired scene for the product..."
                className="w-full h-24 bg-brand-dark-light border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
                />
                 <EnhancePromptButton onClick={handleEnhancePrompt} isLoading={isEnhancing} disabled={!prompt || isLoading} />
            </div>
        </div>
        
        <div>
          <SectionHeader title="Select an Ad Style" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {AD_STYLES.map(style => (
              <SpotlightCard
                key={style}
                onClick={() => setSelectedStyle(style)}
                spotlightColor="rgba(217, 70, 239, 0.2)"
                className={`p-3 text-center rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                  selectedStyle === style 
                    ? 'bg-fuchsia-500 text-white ring-2 ring-offset-2 ring-offset-black ring-fuchsia-600' 
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
            Generate Ad Image
          </Button>
        </div>
        {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
      </div>

      {/* Right Column: Output */}
      <div>
        <SectionHeader title="Ad Preview" />
        <div className="mt-4 w-full aspect-square bg-black border-2 border-dashed border-brand-dark-lighter rounded-2xl flex items-center justify-center p-2">
            <div className="w-full h-full flex items-center justify-center">
                {isLoading ? <Spinner /> : (
                    displayImage ? (
                        <img src={displayImage} alt="Ad preview" className="rounded-lg shadow-lg max-w-full max-h-full object-contain" />
                    ) : (
                        <PreviewPlaceholder text="Upload a product image to get started" />
                    )
                )}
            </div>
        </div>
        {generatedImage && (
             <a 
              href={generatedImage} 
              download={`beauty-ad-${selectedStyle.toLowerCase()}.png`}
              className="mt-6 block w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors"
            >
              Download Image
            </a>
        )}
      </div>
    </div>
  );
};

export default BeautyAdStudio;