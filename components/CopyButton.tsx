
import React, { useState } from 'react';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-brand-dark-lighter text-gray-300 hover:bg-brand-purple'
      }`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton;
