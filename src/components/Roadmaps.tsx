import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient.ts';

interface Roadmap {
  id: string;
  title: string;
  description: string;
  slug: string;
  image_url: string;
}

interface RoadmapsProps {
  onRoadmapSelect: (roadmap: Roadmap) => void;
}

export default function Roadmaps({ onRoadmapSelect }: RoadmapsProps) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  useEffect(() => {
    async function fetchRoadmaps() {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data, error } = await supabase.from('roadmaps').select('*');
      if (error) console.error('Roadmaps fetch error:', error);
      if (data) setRoadmaps(data);
    }
    fetchRoadmaps();
  }, []);

  return (
    <div className="py-12 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">Learning Paths</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className="group bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-accent/50 hover:shadow-2xl hover:shadow-emerald-accent/10 transition-all duration-300"
            onClick={() => onRoadmapSelect(roadmap)}
          >
            {roadmap.image_url && (
              <img src={roadmap.image_url} alt={roadmap.title} className="w-full aspect-video object-cover" />
            )}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-accent transition duration-300">{roadmap.title}</h2>
              <p className="text-gray-400 leading-relaxed">{roadmap.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
