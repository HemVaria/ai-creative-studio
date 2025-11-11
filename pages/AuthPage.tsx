import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuthAction = async (action: 'login' | 'signup') => {
    if (!email || !password) {
        setError("Email and password cannot be empty.");
        return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (action === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 font-sans">
      <div className="flex flex-col gap-y-2.5 px-8 pt-2 pb-1 bg-zinc-900 rounded-3xl transition-transform duration-300 ease-in-out hover:scale-105 w-full max-w-sm">
        <p className="text-center my-8 text-white text-lg font-semibold">Login</p>
        
        {/* Email Field */}
        <div className="flex items-center gap-x-2 rounded-3xl p-2.5 bg-zinc-900 shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
          <svg className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
          </svg>
          <input 
            autoComplete="off" 
            placeholder="Email" 
            className="bg-transparent border-none focus:outline-none w-full text-gray-300 placeholder-gray-500" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center gap-x-2 rounded-3xl p-2.5 bg-zinc-900 shadow-[inset_2px_5px_10px_rgb(5,5,5)]">
          <svg className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>
          <input 
            placeholder="Password" 
            className="bg-transparent border-none focus:outline-none w-full text-gray-300 placeholder-gray-500" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center mt-10">
          <button 
            type="button"
            onClick={() => handleAuthAction('login')}
            disabled={loading}
            className="py-2 px-6 rounded-md mr-2 border-none outline-none transition-colors duration-300 ease-in-out bg-zinc-800 text-white hover:bg-black disabled:opacity-50"
          >
            {loading ? '...' : 'Login'}
          </button>
          <button 
            type="button"
            onClick={() => handleAuthAction('signup')}
            disabled={loading}
            className="py-2 px-9 rounded-md border-none outline-none transition-colors duration-300 ease-in-out bg-zinc-800 text-white hover:bg-black disabled:opacity-50"
          >
            {loading ? '...' : 'Sign Up'}
          </button>
        </div>

        {/* Status Messages */}
        <div className="h-6 mt-4 text-center text-sm">
            {error && <p className="text-red-400">{error}</p>}
            {message && <p className="text-green-400">{message}</p>}
        </div>
        
        {/* Forgot Password */}
        <button type="button" className="mb-12 mt-2 p-2 rounded-md border-none outline-none transition-colors duration-300 ease-in-out bg-zinc-800 text-white hover:bg-red-600">
          Forgot Password
        </button>
      </div>

       <p className="text-center text-gray-600 text-xs mt-6">
            Hint: You can sign up with <code className="bg-gray-800 p-1 rounded">demo@example.com</code> and any password for testing.
        </p>
    </div>
  );
};

export default AuthPage;
