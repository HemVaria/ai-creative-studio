import React from 'react';
import { Sparkles } from 'lucide-react';

interface EnhancePromptButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const EnhancePromptButton: React.FC<EnhancePromptButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className="flex items-center gap-2 text-xs font-medium text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/30 border border-purple-500/20 hover:border-purple-500/50 rounded-lg px-3 py-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
      title="Enhance prompt with AI"
    >
      {isLoading ? (
        <>
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Enhancing...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3 h-3" />
          <span>Enhance</span>
        </>
      )}
    </button>
  );
};

export default EnhancePromptButton;
