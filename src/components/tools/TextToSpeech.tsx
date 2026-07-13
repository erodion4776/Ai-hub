import React, { useState } from 'react';
import { getDeviceId } from '../../lib/deviceId.ts';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  async function handleGenerate() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const res = await fetch('/.netlify/functions/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, deviceId: getDeviceId() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      const audioBlob = await (await fetch(`data:audio/mp3;base64,${data.audio}`)).blob();
      setAudioUrl(URL.createObjectURL(audioBlob));
      setRemaining(data.remaining);
    } catch (err) {
      console.error(err);
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-2 text-white">Text to Speech</h1>
      <p className="text-gray-400 mb-8">Turn text into natural-sounding speech. Free, with a daily limit.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
        rows={5}
        placeholder="Type something to hear it spoken aloud..."
        className="w-full bg-gray-800 text-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-accent resize-none"
      />
      <div className="flex justify-between items-center mt-2 mb-6 text-sm text-gray-500">
        <span>{text.length}/500 characters</span>
        {remaining !== null && <span>{remaining} generations left today</span>}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !text.trim()}
        className="w-full bg-emerald-accent text-midnight py-3 rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : 'Generate Speech'}
      </button>

      {error && (
        <p className="mt-4 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3">{error}</p>
      )}

      {audioUrl && (
        <div className="mt-6">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
