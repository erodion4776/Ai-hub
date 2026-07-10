import React from 'react';
import { Search } from 'lucide-react';

export default function Discovery() {
  return (
    <section id="discovery" className="py-12 bg-midnight/50">
      <div className="max-w-4xl mx-auto flex gap-4 items-center bg-gray-800 p-2 rounded-lg">
        <Search className="text-gray-400 ml-2" />
        <input type="text" placeholder="Search tutorials..." className="w-full bg-transparent p-2 text-white placeholder-gray-400 outline-none" />
      </div>
      <div className="flex justify-center gap-4 mt-6">
        {['Image Gen', 'Video', 'Automation'].map(cat => (
          <button key={cat} className="px-4 py-2 rounded-full border border-emerald-accent text-emerald-accent hover:bg-emerald-accent hover:text-midnight transition">{cat}</button>
        ))}
      </div>
    </section>
  );
}
