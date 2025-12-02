"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import StudioSelection from '@/components/StudioSelection';
import Spinner from '@/components/Spinner';
import Header from '@/components/Header';

export default function Home() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-sans text-white flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Header />
      <main className="container mx-auto px-4 py-12 sm:py-20">
        <StudioSelection />
      </main>
    </div>
  );
}
