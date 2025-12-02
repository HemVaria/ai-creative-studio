"use client";
import React from 'react';
import BeautyAdStudio from '@/studios/BeautyAdStudio';
import Header from '@/components/Header';
import { Studio } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import Spinner from '@/components/Spinner';

export default function BeautyPage() {
  const { session, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Spinner /></div>;
  if (!session) return <AuthPage />;

  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Header activeStudio={Studio.Beauty} />
      <main className="container mx-auto px-4 py-12 sm:py-20">
        <BeautyAdStudio />
      </main>
    </div>
  );
}
