import React from 'react';
import ReactMarkdown from 'react-markdown';

interface TutorialDetailProps {
  video: any;
  onBack: () => void;
}

export default function TutorialDetail({ video, onBack }: TutorialDetailProps) {
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
          <h2 className="text-4xl font-bold mb-6 text-white">Detailed Tutorial Guide</h2>
          <div className="prose prose-invert prose-emerald prose-lg">
             <ReactMarkdown>{video.article_body}</ReactMarkdown>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl h-fit">
          <h3 className="text-2xl font-bold mb-4 text-emerald-accent">Featured Tools</h3>
          {/* Placeholder for tools list */}
          <p className="text-gray-300">Tools used will be listed here.</p>
        </div>
      </div>
    </div>
  );
}
