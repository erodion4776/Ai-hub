import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient.ts';

interface VideoGridProps {
  onVideoSelect: (video: any) => void;
}

export default function VideoGrid({ onVideoSelect }: VideoGridProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      const supabase = getSupabase();
      if (!supabase) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('date_added', { ascending: false });

      if (error) console.error('VideoGrid fetch error:', error);
      if (data) setVideos(data);
      setLoading(false);
    }
    fetchVideos();
  }, []);

  if (loading) {
    return <section className="py-12 px-6 text-center text-gray-400">Loading tutorials…</section>;
  }

  if (videos.length === 0) {
    return <section className="py-12 px-6 text-center text-gray-400">No tutorials yet.</section>;
  }

  return (
    <section className="py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div
            key={video.video_id}
            className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-700 transition"
            onClick={() => onVideoSelect(video)}
          >
            {video.thumbnail_url && (
              <img src={video.thumbnail_url} alt={video.title} className="w-full aspect-video object-cover" />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{video.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{video.category}</p>
              <button className="w-full bg-emerald-accent text-midnight py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">
                Get Tool
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
