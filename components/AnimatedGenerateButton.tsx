"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnimatedGenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isGenerating: boolean;
  text?: string;
  loadingText?: string;
}

const AnimatedGenerateButton: React.FC<AnimatedGenerateButtonProps> = ({
  isGenerating,
  text = "Generate",
  loadingText = "Generating...",
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "relative w-full group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all duration-300",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01] active:scale-[0.99]",
        className
      )}
      disabled={disabled || isGenerating}
      {...props}
    >
      <span className={cn(
        "absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]",
        disabled && "hidden"
      )} />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-8 py-4 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900">
        {isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {loadingText}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center"
          >
            <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            {text}
          </motion.div>
        )}
      </span>
    </button>
  );
};

export default AnimatedGenerateButton;
