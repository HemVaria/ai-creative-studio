"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ImageInput from '../components/ImageInput';
import AnimatedGenerateButton from '../components/AnimatedGenerateButton';
import Spinner from '../components/Spinner';
import SpotlightCard from '../components/SpotlightCard';
import { generateBeautyAdImageAction, generateBeautyAdImageExperimentalAction, enhancePromptAction, checkConfigurationAction } from '../app/actions';
import EnhancePromptButton from '../components/EnhancePromptButton';
import { useAuth } from '../contexts/AuthContext';
import { uploadAndSaveGeneration } from '../services/supabaseService';
import { Studio } from '../types';
import { Download, Sparkles, Image as ImageIcon, Settings, CheckCircle, XCircle } from 'lucide-react';

const AD_STYLES = [
  'Bold Modern', 
  'Dark Luxe', 
  'Vintage', 
  'Scandinavian', 
  'Pop Art', 
  'Neon Glow', 
  'Organic'
];

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

const BeautyAdStudio: React.FC = () => {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [adText, setAdText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>(AD_STYLES[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [adCopy, setAdCopy] = useState<{headline: string, tagline: string} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useExperimental, setUseExperimental] = useState<boolean>(true);
  const [configStatus, setConfigStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [configMessage, setConfigMessage] = useState<string>('');
  
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

  const handleCheckConfig = useCallback(async () => {
    setConfigStatus('checking');
    const apiKey = localStorage.getItem('google_api_key') || undefined;
    const result = await checkConfigurationAction(apiKey);
    setConfigStatus(result.status);
    setConfigMessage(result.message);
    setTimeout(() => {
        if (result.status === 'ok') setConfigStatus('idle');
    }, 3000);
  }, []);

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
    if (!imageFile || !prompt) {
      setError('Please upload a product image and describe the scene.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setAdCopy(null);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('prompt', prompt);
      formData.append('style', selectedStyle);
      if (adText) formData.append('adText', adText);
      
      const apiKey = localStorage.getItem('google_api_key');
      if (apiKey) formData.append('apiKey', apiKey);

      let resultImage = "";

      if (useExperimental) {
        const result = await generateBeautyAdImageExperimentalAction(formData);
        setGeneratedImage(`data:image/png;base64,${result.image}`);
        setAdCopy({ headline: result.headline, tagline: result.tagline });
        resultImage = `data:image/png;base64,${result.image}`;
      } else {
        const result = await generateBeautyAdImageAction(formData);
        setGeneratedImage(`data:image/png;base64,${result}`);
        resultImage = `data:image/png;base64,${result}`;
      }

      if (user) {
        try {
          await uploadAndSaveGeneration(
            resultImage,
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
  }, [imageFile, prompt, selectedStyle, user, useExperimental, adText]);
  
  const displayImage = generatedImage || imagePreview;
  const isFormValid = !!imageFile && !!prompt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Inputs */}
      <div className="lg:col-span-5 space-y-8">
        
        {/* Config Check */}
        <div className="flex items-center justify-between bg-zinc-900/30 border border-white/5 rounded-xl p-3">
            <span className="text-xs text-zinc-400 flex items-center gap-2">
                <Settings className="w-3 h-3" /> API Status
            </span>
            <button 
                onClick={handleCheckConfig}
                disabled={configStatus === 'checking'}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
                    configStatus === 'ok' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                    configStatus === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                    'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
            >
                {configStatus === 'checking' ? <Spinner className="w-3 h-3" /> : 
                 configStatus === 'ok' ? <><CheckCircle className="w-3 h-3" /> Ready</> :
                 configStatus === 'error' ? <><XCircle className="w-3 h-3" /> Error</> :
                 'Check Config'}
            </button>
        </div>
        {configStatus === 'error' && <p className="text-xs text-red-400 px-1">{configMessage}</p>}


        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <SectionHeader title="Upload Product" subtitle="Use a clean product shot, ideally on a transparent background (PNG)." />
          <div className="mt-4">
             <ImageInput 
                onImageSelect={handleImageSelect}
                title="Drop product image"
                description="or click to browse"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <SectionHeader title="Describe Scene" subtitle="E.g., 'On a black volcanic rock with water splashing.'" />
            <div className="mt-4 relative">
                <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the desired scene for the product..."
                className="w-full h-32 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                />
                <div className="absolute bottom-3 right-3">
                   <EnhancePromptButton onClick={handleEnhancePrompt} isLoading={isEnhancing} disabled={!prompt || isLoading} />
                </div>
            </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <SectionHeader title="Ad Text Overlay" subtitle="Add professional text directly into the image." />
            <input
                type="text"
                value={adText}
                onChange={(e) => setAdText(e.target.value)}
                placeholder="E.g., 'Summer Sale' or 'Pure Elegance'"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
        </div>
        
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
          <SectionHeader title="Ad Style" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {AD_STYLES.map(style => (
              <SpotlightCard
                key={style}
                onClick={() => setSelectedStyle(style)}
                spotlightColor="rgba(217, 70, 239, 0.2)"
                className={`p-3 text-center rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  selectedStyle === style 
                    ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]' 
                    : 'bg-black/40 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {style}
              </SpotlightCard>
            ))}
          </div>
        </div>

        <div className="pt-2 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useExperimental"
              checked={useExperimental}
              onChange={(e) => setUseExperimental(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500 bg-zinc-800 border-white/10"
            />
            <label htmlFor="useExperimental" className="text-sm text-zinc-400 select-none cursor-pointer">
              Use Gemini Vision + Imagen 3 (High Quality)
            </label>
          </div>
          <AnimatedGenerateButton 
            onClick={handleGenerate} 
            disabled={!isFormValid || isLoading} 
            isGenerating={isLoading}
            text="Generate Ad Image"
          />
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
                        displayImage ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img src={displayImage} alt="Ad preview" className="rounded-lg shadow-2xl max-w-full max-h-full object-contain" />
                            </div>
                        ) : (
                            <PreviewPlaceholder text="Upload a product image to get started" />
                        )
                    )}
                </div>
            </div>
            
            {generatedImage && (
                <div className="p-4">
                    <a 
                    href={generatedImage} 
                    download={`beauty-ad-${selectedStyle.toLowerCase()}.png`}
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

export default BeautyAdStudio;