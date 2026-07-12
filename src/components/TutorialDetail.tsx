import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getSupabase } from '../lib/supabaseClient.ts';

interface TutorialDetailProps {
  video: any;
  onBack: () => void;
}

export default function TutorialDetail({ video, onBack }: TutorialDetailProps) {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTools() {
      const supabase = getSupabase();
      if (!supabase || !video.ai_summary) return;

      const toolNames = video.ai_summary.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (toolNames.length === 0) return;

      const { data, error } = await supabase
        .from('affiliate_tools')
        .select('*')
        .in('tool_name', toolNames)
        .eq('is_active', true);

      if (error) console.error('Tools fetch error:', error);
      if (data) setTools(data);
    }
    fetchTools();
  }, [video.ai_summary]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <button onClick={onBack} className="mb-6 text-gray-400 hover:text-white">&larr; Back to Library</button>

      <div className="aspect-video mb-8">
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${video.video_id}`}
          title={video.title}
          allowFullScreen
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-4xl font-bold mb-6 text-white">{video.title}</h2>
          <div className="prose prose-invert prose-emerald prose-lg">
            <ReactMarkdown>{video.article_body}</ReactMarkdown>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl h-fit">
          <h3 className="text-2xl font-bold mb-4 text-emerald-accent">Featured Tools</h3>
          {tools.length === 0 ? (
            <p className="text-gray-300">No tools linked yet.</p>
          ) : (
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.tool_name}>
                  <a
                    href={tool.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-emerald-accent hover:underline font-semibold"
                  >
                    {tool.tool_name} &rarr;
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
