import React, { useState, useRef, useEffect } from 'react';

const DAILY_LIMIT = 30;
const STORAGE_KEY = 'aihub_chat_usage';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

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

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! Ask me anything — I'm here to help." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedToday, setUsedToday] = useState(getTodayUsage());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    if (usedToday >= DAILY_LIMIT) {
      setError(`Daily limit reached (${DAILY_LIMIT} messages/day). Try again tomorrow.`);
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      // Legacy no-key Pollinations text endpoint. Sends OpenAI-style message
      // history for a real multi-turn conversation, not just a single prompt.
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful, concise AI assistant.' },
            ...nextMessages,
          ],
          model: 'openai',
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const reply = (await res.text()).trim();
      setMessages((prev) => [...prev, { role: 'assistant', content: reply || "Sorry, I didn't catch that — try again?" }]);
      setUsedToday(incrementTodayUsage());
    } catch (err) {
      console.error('ChatAssistant error:', err);
      setError('Could not reach the assistant. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 flex flex-col h-[80vh]">
      <h1 className="text-4xl font-bold mb-2 text-white">AI Chat Assistant</h1>
      <p className="text-gray-400 mb-6">Ask questions, brainstorm, or get quick help. Free, with a daily limit.</p>

      <div className="flex-1 overflow-y-auto bg-gray-900/50 border border-gray-800 rounded-2xl p-4 mb-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-emerald-accent text-midnight'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 rounded-xl px-4 py-2">Thinking…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mb-3 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm">{error}</p>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          className="flex-1 bg-gray-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-accent resize-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-emerald-accent text-midnight px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">{DAILY_LIMIT - usedToday} messages left today</p>
    </div>
  );
}
