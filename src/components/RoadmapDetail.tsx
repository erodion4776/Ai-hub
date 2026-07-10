import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { getSupabase } from '../lib/supabaseClient.ts';

interface Step {
  id: string;
  title: string;
  video_id: string;
  tools: string[];
}

export default function RoadmapDetail({ roadmap, onBack }: { roadmap: any, onBack: () => void }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    async function fetchSteps() {
      const supabase = getSupabase();
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('roadmap_steps')
        .select('*')
        .eq('roadmap_id', roadmap.id);
        
      if (data) setSteps(data);
    }
    fetchSteps();
    
    const saved = localStorage.getItem(`roadmap-${roadmap.id}-completed`);
    if (saved) setCompleted(JSON.parse(saved));
  }, [roadmap.id]);

  const toggleComplete = (stepId: string) => {
    const newCompleted = completed.includes(stepId)
      ? completed.filter(id => id !== stepId)
      : [...completed, stepId];
    setCompleted(newCompleted);
    localStorage.setItem(`roadmap-${roadmap.id}-completed`, JSON.stringify(newCompleted));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <button onClick={onBack} className="mb-8 flex items-center text-gray-400 hover:text-emerald-accent transition">
        <span className="mr-2">&larr;</span> Back to Roadmaps
      </button>
      <h1 className="text-5xl font-extrabold mb-10 tracking-tight text-white">{roadmap.title}</h1>
      
      <div className="space-y-16">
        {steps.map((step) => (
          <div key={step.id} className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold mb-6 text-emerald-accent">{step.title}</h2>
            <div className="aspect-video mb-6 overflow-hidden rounded-2xl shadow-lg shadow-black/50">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${step.video_id}`} allowFullScreen />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-400">Tools: <span className="font-mono bg-gray-800 px-2 py-1 rounded text-emerald-accent/80">{step.tools ? step.tools.join(', ') : ''}</span></p>
              <button 
                onClick={() => toggleComplete(step.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${completed.includes(step.id) ? 'bg-emerald-accent text-midnight' : 'bg-transparent border-2 border-gray-700 hover:border-emerald-accent text-white'}`}
              >
                <Check size={18} /> {completed.includes(step.id) ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-gradient-to-br from-gray-900 to-gray-800 p-12 rounded-3xl border border-gray-700 text-center shadow-2xl">
        <h2 className="text-4xl font-bold mb-4">🎉 Certificate of Completion</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">You've mastered the steps. Download your resources and claim your certification.</p>
        <a href="https://selar.co" target="_blank" rel="noopener noreferrer" className="inline-block bg-emerald-accent text-midnight px-10 py-5 rounded-full font-extrabold text-lg hover:bg-white hover:text-emerald-accent transition duration-300 transform hover:scale-105">Download Master Prompt Library</a>
      </div>
    </div>
  );
}
