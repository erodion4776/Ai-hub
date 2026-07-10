import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient.ts';

interface VideoGridProps {
  onVideoSelect: (video: any) => void;
}

export default function VideoGrid({ onVideoSelect }: VideoGridProps) {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchVideos() {
      const supabase = getSupabase();
      if (!supabase) return;
      
      const { data, error } = await supabase.from('videos').select('*');
      if (data) setVideos(data);
    }
    fetchVideos();
  }, []);
  
  return (
    <section className="py-12 px-6">
      <h2 className="text-3xl font-bold mb-8 text-white">Recommended Tutorials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.id} className="group bg-gray-900/50 border border-gray-800 p-8 rounded-2xl cursor-pointer hover:border-emerald-accent/50 hover:shadow-2xl hover:shadow-emerald-accent/10 transition-all duration-300" onClick={() => onVideoSelect(video)}>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-accent transition duration-300">{video.title}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">{video.category}</p>
            <button className="w-full bg-emerald-accent/10 border border-emerald-accent/20 text-emerald-accent py-3 rounded-full font-semibold group-hover:bg-emerald-accent group-hover:text-midnight transition-all duration-300">View Tutorial</button>
          </div>
        ))}
      </div>
    </section>
  );
}
