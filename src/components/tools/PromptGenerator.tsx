import React, { useState } from 'react';
import { Copy, Check, ImageIcon } from 'lucide-react';

const DAILY_LIMIT = 20;
const STORAGE_KEY = 'aihub_promptgen_usage';

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
  const next = getTodayUsage() + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: next }));
  return next;
}

type PromptType = 'image' | 'video';

interface PromptGeneratorProps {
  onUseInImageGenerator?: (prompt: string) => void;
}

const SYSTEM_PROMPTS: Record<PromptType, string> = {
  image: `You are an expert prompt engineer for AI image generators like Midjourney, Flux, and Stable Diffusion.
Given a simple idea, expand it into ONE detailed, vivid image-generation prompt.
Include: subject detail, setting, lighting, camera/lens style, mood, and art style.
Output ONLY the final prompt text — no explanations, no quotes, no markdown, no preamble.`,
  video: `You are an expert prompt engineer for AI video generators like Veo, Sora, and Runway.
Given a simple idea, expand it into ONE detailed video-generation prompt.
Include: subject and action, camera movement (e.g. dolly in, pan, static), setting, lighting, pacing/mood, and visual style.
Output ONLY the final prompt text — no explanations, no quotes, no markdown, no preamble.`,
};

export default function PromptGenerator({ onUseInImageGenerator }: PromptGeneratorProps) {
  const [type, setType] = useState<PromptType>('image');
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [usedToday, setUsedToday] = useState(getTodayUsage());

  async function handleGenerate() {
    const trimmed = idea.trim();
    if (!trimmed) return;

    if (usedToday >= DAILY_LIMIT) {
      setError(`Daily limit reached (${DAILY_LIMIT}/day). Try again tomorrow.`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult('');
    setCopied(false);

    try {
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPTS[type] },
            { role: 'user', content: trimmed },
          ],
          model: 'openai',
        }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const text = (await res.text()).trim();
      setResult(text);
      setUsedToday(incrementTodayUsage());
    } catch (err) {
      console.error('PromptGenerator error:', err);
      setError('Could not generate a prompt right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-2 text-white">Image & Video Prompt Generator</h1>
      <p className="text-gray-400 mb-8">Turn a simple idea into a detailed prompt for AI image or video tools. Free, with a daily limit.</p>

      <div className="flex gap-2 mb-6">
        {(['image', 'video'] as PromptType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-5 py-2 rounded-full font-semibold capitalize transition ${
              type === t
                ? 'bg-emerald-accent text-midnight'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {t} Prompt
          </button>
        ))}
      </div>

      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={3}
        placeholder={type === 'image' ? 'e.g. a fox in a snowy forest at dawn' : 'e.g. a drone shot flying over a coastal city at sunset'}
        className="w-full bg-gray-800 text-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-accent resize-none mb-2"
      />
      <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
        <span>Describe your idea in a few words</span>
        <span>{DAILY_LIMIT - usedToday} left today</span>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !idea.trim()}
        className="w-full bg-emerald-accent text-midnight py-3 rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : `Generate ${type === 'image' ? 'Image' : 'Video'} Prompt`}
      </button>

      {error && (
        <p className="mt-4 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3">{error}</p>
      )}

      {result && (
        <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
          <p className="text-white whitespace-pre-wrap mb-4">{result}</p>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition text-sm font-semibold"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
            {type === 'image' && onUseInImageGenerator && (
              <button
                onClick={() => onUseInImageGenerator(result)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-accent text-midnight hover:bg-emerald-600 transition text-sm font-semibold"
              >
                <ImageIcon size={16} />
                Use in Image Generator
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
