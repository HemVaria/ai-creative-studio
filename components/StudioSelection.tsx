"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Shirt, Utensils, Sparkles } from 'lucide-react';

const studios = [
  {
    id: 'real-estate',
    title: 'Real Estate Staging',
    description: 'Transform empty spaces into furnished homes.',
    icon: Home,
    color: 'from-sky-400 to-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    href: '/studio/real-estate',
    colSpan: 'md:col-span-2',
  },
  {
    id: 'fashion',
    title: 'Virtual Fashion',
    description: 'Try on outfits virtually.',
    icon: Shirt,
    color: 'from-pink-400 to-rose-600',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    href: '/studio/fashion',
    colSpan: 'md:col-span-1',
  },
  {
    id: 'restaurant',
    title: 'Menu Visualizer',
    description: 'Generate mouth-watering food images.',
    icon: Utensils,
    color: 'from-amber-400 to-orange-600',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    href: '/studio/restaurant',
    colSpan: 'md:col-span-1',
  },
  {
    id: 'beauty',
    title: 'Beauty Ads',
    description: 'Create stunning product campaigns.',
    icon: Sparkles,
    color: 'from-fuchsia-400 to-purple-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    href: '/studio/beauty',
    colSpan: 'md:col-span-2',
  },
];

const StudioSelection: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-20 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 mb-6">
            Powered by Gemini 2.0 Flash
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Create with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Intelligence</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A suite of professional AI tools designed to transform your creative workflow. 
            Select a studio below to begin your journey.
          </p>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        {studios.map((studio, index) => (
          <motion.div
            key={studio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${studio.colSpan} group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors duration-300`}
          >
            <Link href={studio.href} className="block p-8 h-full">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${studio.bg}`} />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${studio.color} shadow-lg`}>
                    <studio.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{studio.title}</h3>
                  <p className="text-zinc-400">{studio.description}</p>
                </div>
                
                <div className="mt-8 flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                  Enter Studio <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudioSelection;
