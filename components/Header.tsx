"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Image as ImageIcon, LayoutGrid, LogOut } from 'lucide-react';
import { Studio } from '../types';

interface HeaderProps {
  activeStudio?: Studio;
}

const Header: React.FC<HeaderProps> = ({ activeStudio }) => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'absolute rounded-full bg-gradient-radial from-white/30 to-transparent pointer-events-none animate-ping';
    ripple.style.left = `${x - 25}px`;
    ripple.style.top = `${y - 25}px`;
    ripple.style.width = '50px';
    ripple.style.height = '50px';
    ripple.style.animation = 'ripple 0.6s linear';
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    signOut();
  };

  return (
    <>
      <style jsx global>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      <header className="sticky top-3 z-50 text-white w-full max-w-4xl mx-auto mb-8">
        <div className="mx-auto max-w-7xl px-3">
          <div className="h-14 flex ring-1 ring-white/10 bg-zinc-900/60 backdrop-blur-xl rounded-full pr-2.5 pl-2.5 items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex gap-0 items-center">
              <svg className="md:w-14 md:h-14 w-[36px] h-[36px]" viewBox="0 0 48 48" aria-hidden="true" strokeWidth="2" style={{ width: '36px', height: '36px' }}>
                <path d="M24 8 L36 16 L36 32 L24 40 L12 32 L12 16 Z" fill="currentColor"></path>
              </svg>
              <span className="text-base font-semibold tracking-tight font-sans">AI Studio</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
              <Link href="/" className="hover:text-white transition font-sans flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Studios
              </Link>
              <Link href="/gallery" className="hover:text-white transition font-sans flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Gallery
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <span className="px-3 py-1.5 text-sm rounded-md text-slate-300 hover:text-white transition font-sans">
                  {user.email?.split('@')[0]}
                </span>
              )}
              
              <button 
                onClick={handleSignOut}
                className="liquid-glass-button relative inline-flex h-10 cursor-pointer outline-none overflow-hidden transition-all duration-300 ease-out text-sm font-medium text-white/90 bg-gradient-to-r from-white/10 to-white/5 border-white/15 border rounded-full pr-6 pl-6 shadow-lg backdrop-blur-xl items-center justify-center hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10"
                style={{
                  boxShadow: '0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 3px 3px 0.5px -3px rgba(255,255,255,0.2), inset -3px -3px 0.5px -3px rgba(255,255,255,0.1), inset 1px 1px 1px -0.5px rgba(255,255,255,0.3), inset -1px -1px 1px -0.5px rgba(255,255,255,0.15), inset 0 0 6px 6px rgba(255,255,255,0.05), inset 0 0 2px 2px rgba(255,255,255,0.02), 0 0 12px rgba(0,0,0,0.1)'
                }}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-white/3"></div>
                </div>
                <span className="relative z-10">Sign Out</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/5"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
