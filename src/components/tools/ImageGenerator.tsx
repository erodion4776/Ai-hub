import React, { useState } from 'react';

const DAILY_LIMIT = 15; // soft client-side limit; Pollinations itself is free/unmetered
const STORAGE_KEY = 'aihub_imagegen_usage';

function getTodayUsage(): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return 0;
  try {
    const { date, count } = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    return date === today ? count : 0;
  } catch {
    return 0;
  }
}

function incrementTodayUsage(): number {
  const today = new Date().toISOString().slice(0, 10);
  const current = getTodayUsage();
  const next = current + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: next }));
  return next;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedToday, setUsedToday] = useState(getTodayUsage());

  function handleGenerate() {
    if (!prompt.trim()) return;

    if (usedToday >= DAILY_LIMIT) {
      setError(`Daily limit reached (${DAILY_LIMIT} images/day). Try again tomorrow.`);
      return;
    }

    setError(null);
    setLoading(true);
    setImageUrl(null);

    // Pollinations generates on-request via the image URL itself — no API key,
    // no cost, no signup, using the legacy image.pollinations.ai domain which
    // remains the genuinely anonymous/free endpoint (the newer gen.pollinations.ai
    // unified gateway now requires a bearer token for the same endpoint).
    const seed = Date.now();
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=768&height=768&nologo=true`;
    setImageUrl(url);
    setUsedToday(incrementTodayUsage());
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-2 text-white">AI Image Generator</h1>
      <p className="text-gray-400 mb-8">Describe anything and get an AI-generated image. Free, forever.</p>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        placeholder="A neon-lit cyberpunk market street at night..."
        className="w-full bg-gray-800 text-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-accent"
      />
      <div className="flex justify-between items-center mt-2 mb-6 text-sm text-gray-500">
        <span>Press Enter or click Generate</span>
        <span>{DAILY_LIMIT - usedToday} generations left today</span>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full bg-emerald-accent text-midnight py-3 rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Image
      </button>

      {error && (
        <p className="mt-4 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3">{error}</p>
      )}

      {imageUrl && (
        <div className="mt-6 rounded-xl overflow-hidden bg-gray-800">
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError('Image generation failed or timed out — try again.');
              setImageUrl(null);
            }}
          />
        </div>
      )}
      {loading && <p className="mt-4 text-gray-400 text-center">Generating your image…</p>}
    </div>
  );
}
