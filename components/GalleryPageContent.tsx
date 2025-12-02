"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchGenerations } from '../services/supabaseService';
import { GeneratedImage } from '../types';
import Spinner from '../components/Spinner';
import GalleryImageCard from '../components/GalleryImageCard';
import { Image as ImageIcon } from 'lucide-react';

const GalleryPage: React.FC = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      if (!user) {
        setLoading(false);
        setError("You must be logged in to see your gallery.");
        return;
      }
      try {
        setLoading(true);
        const fetchedImages = await fetchGenerations(user.id);
        setImages(fetchedImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [user]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }

    if (images.length === 0) {
      return (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/10">
            <ImageIcon className="w-10 h-10 text-zinc-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Your Gallery is Empty</h3>
          <p className="text-zinc-400 max-w-md mx-auto">Start creating images in one of the studios to see them here.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <GalleryImageCard key={image.id} image={image} />
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">My Gallery</h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">A collection of all your AI-generated creations.</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default GalleryPage;