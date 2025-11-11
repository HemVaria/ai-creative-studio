import React from 'react';

interface EnhancePromptButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const EnhancePromptButton: React.FC<EnhancePromptButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <div className="flex justify-end mt-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading || disabled}
        className="flex items-center justify-center space-x-2 text-xs font-semibold text-purple-300 hover:text-white bg-purple-600/20 hover:bg-purple-600/50 rounded-md px-3 py-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600/20"
        title="Enhance prompt with AI"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Enhancing...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>Enhance</span>
          </>
        )}
      </button>
    </div>
  );
};

export default EnhancePromptButton;
