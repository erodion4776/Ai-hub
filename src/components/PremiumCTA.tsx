import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient.ts';

export default function PremiumCTA() {
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLink() {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'premium_cta_link')
        .single();

      if (error) console.error('PremiumCTA link fetch error:', error);
      if (data) setLink(data.value);
    }
    fetchLink();
  }, []);

  return (
    <footer className="py-12 bg-black border-t border-gray-800 text-center">
      <h2 className="text-3xl font-bold mb-4">Want the Full Prompt Library?</h2>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer sponsored" className="text-emerald-accent font-bold hover:underline">
          Get Access on Selar.co
        </a>
      ) : (
        <span className="text-gray-500 font-bold">Loading…</span>
      )}
    </footer>
  );
}
