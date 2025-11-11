
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, ...props }) => {
  const baseClasses = "w-full font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark";
  
  const variantClasses = {
    primary: 'bg-brand-purple text-white hover:bg-brand-purple-light focus:ring-brand-purple',
    secondary: 'bg-brand-dark-lighter text-gray-300 hover:bg-gray-600 focus:ring-gray-500',
  };

  const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Generating...' : children}
    </button>
  );
};

export default Button;
