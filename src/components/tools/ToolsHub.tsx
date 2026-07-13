import React from 'react';
import { ImageIcon, Mic, Sparkles } from 'lucide-react';

interface ToolsHubProps {
  onToolSelect: (tool: string) => void;
}

const TOOLS = [
  {
    id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Turn any text prompt into an image. Free, forever.',
    icon: ImageIcon,
    available: true,
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Natural-sounding voice from any text.',
    icon: Mic,
    available: true,
  },
  {
    id: 'coming-soon-1',
    name: 'More tools coming soon',
    description: "We're adding more AI tools regularly.",
    icon: Sparkles,
    available: false,
  },
];

export default function ToolsHub({ onToolSelect }: ToolsHubProps) {
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-2 text-white text-center">AI Tools</h1>
      <p className="text-gray-400 mb-10 text-center">Free tools, right in your browser.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              disabled={!tool.available}
              onClick={() => tool.available && onToolSelect(tool.id)}
              className={`text-left bg-gray-900/50 border border-gray-800 rounded-2xl p-6 transition-all duration-300 ${
                tool.available
                  ? 'hover:border-emerald-accent/50 hover:shadow-xl hover:shadow-emerald-accent/10 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Icon className="text-emerald-accent mb-4" size={32} />
              <h2 className="text-xl font-bold text-white mb-2">{tool.name}</h2>
              <p className="text-gray-400 text-sm">{tool.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
