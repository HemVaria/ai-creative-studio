import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchGenerations } from '../services/supabaseService';
import { GeneratedImage } from '../types';
import Spinner from '../components/Spinner';
import GalleryImageCard from '../components/GalleryImageCard';

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
        <div className="text-center text-gray-500 py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l2-2a2 2 0 012.828 0l2 2M5 8h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1z" />
          </svg>
          <h3 className="text-2xl font-semibold text-white">Your Gallery is Empty</h3>
          <p className="mt-2">Start creating images in one of the studios to see them here.</p>
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
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">My Gallery</h1>
        <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">A collection of all your AI-generated creations.</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default GalleryPage;