import React from 'react';

export default function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-6xl font-extrabold mb-6">Master the <span className="text-emerald-accent">AI Revolution</span>.</h1>
      <p className="text-xl mb-10 text-gray-300">Your curated hub for the latest AI tutorials and tools.</p>
      <a href="#discovery" className="bg-emerald-accent text-midnight px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-600 transition">Browse Library</a>
    </section>
  );
}
