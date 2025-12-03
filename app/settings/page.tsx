"use client";

import React, { useState, useEffect } from 'react';
import { Save, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { checkConfigurationAction } from '../actions';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('google_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = async () => {
    setStatus('saving');
    setMessage('');

    try {
      // Verify the key works
      const result = await checkConfigurationAction(apiKey);
      
      if (result.status === 'ok') {
        localStorage.setItem('google_api_key', apiKey);
        setStatus('success');
        setMessage('API Key saved and verified successfully!');
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to verify API key.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-12 px-4">
      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/30">
            <Key className="w-6 h-6 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">API Settings</h1>
            <p className="text-zinc-400">Configure your Google Gemini API key</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Your key is stored locally in your browser. It is never sent to our servers, only to Google's API via our secure proxy.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              {status === 'success' && (
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> {message}
                </span>
              )}
              {status === 'error' && (
                <span className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {message}
                </span>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={status === 'saving' || !apiKey}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                status === 'saving' || !apiKey
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {status === 'saving' ? (
                'Verifying...'
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Key
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
