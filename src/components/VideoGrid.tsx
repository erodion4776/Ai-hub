import React from 'react';

interface VideoGridProps {
  onVideoSelect: (video: any) => void;
}

export default function VideoGrid({ onVideoSelect }: VideoGridProps) {
  // Placeholder for now, will be connected to Supabase
  const videos = [
    { id: 1, video_id: 'dQw4w9WgXcQ', title: 'AI Image Generation', category: 'Image Gen', ai_summary: '...', article_body: '## Intro\nThis is the detailed tutorial for AI Image Gen.' },
    { id: 2, video_id: 'jNQXAC9IVRw', title: 'Video Editing with AI', category: 'Video', ai_summary: '...', article_body: '## Intro\nThis is the detailed tutorial for AI Video Editing.' },
  ];
  
  return (
    <section className="py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <div key={video.id} className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition" onClick={() => onVideoSelect(video)}>
            <h3 className="text-xl font-bold mb-2">{video.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{video.category}</p>
            <button className="w-full bg-emerald-accent text-midnight py-2 rounded-lg font-semibold hover:bg-emerald-600 transition">Get Tool</button>
          </div>
        ))}
      </div>
    </section>
  );
}
