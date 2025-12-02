"use client";
import React from 'react';
import GalleryPageContent from '@/components/GalleryPageContent'; // I'll rename pages/GalleryPage.tsx to components/GalleryPageContent.tsx
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import Spinner from '@/components/Spinner';

export default function GalleryPage() {
  const { session, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Spinner /></div>;
  if (!session) return <AuthPage />;

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Header />
      <main className="container mx-auto px-4 py-12 sm:py-20">
        <GalleryPageContent />
      </main>
    </div>
  );
}
