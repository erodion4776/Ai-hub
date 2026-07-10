import React, { useState } from 'react';
import { getSupabase } from '../lib/supabaseClient.ts';
import { X } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      setMessage('Configuration error: Supabase is not initialized.');
      return;
    }
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signInWithOtp({ email });
    
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
        <h2 className="text-2xl font-bold mb-6">Login / Sign Up</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-midnight text-white mb-4 outline-none border border-gray-700"
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-emerald-accent text-midnight py-3 rounded-lg font-bold hover:bg-emerald-600 transition">
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-center text-gray-300">{message}</p>}
      </div>
    </div>
  );
}
