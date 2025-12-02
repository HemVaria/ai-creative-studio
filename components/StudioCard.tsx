"use client";

import React from 'react';
import Link from 'next/link';
import SpotlightCard from './SpotlightCard';

interface StudioCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  spotlightColor: `rgba(${number}, ${number}, ${number}, ${number})`;
  href: string;
}

const StudioCard: React.FC<StudioCardProps> = ({ icon, title, description, spotlightColor, href }) => (
  <Link href={href} className="block h-full">
    <SpotlightCard
      spotlightColor={spotlightColor}
      className="p-8 rounded-3xl bg-brand-dark-light border border-brand-dark-lighter cursor-pointer transition-all duration-300 transform hover:scale-105 hover:border-gray-600 flex flex-col text-left h-full"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 mb-6 flex-grow">{description}</p>
      <div className="font-semibold text-white group flex items-center">
        Get Started <span className="transform transition-transform duration-300 group-hover:translate-x-2 ml-2">&rarr;</span>
      </div>
    </SpotlightCard>
  </Link>
);

export default StudioCard;
