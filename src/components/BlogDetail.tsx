import React from 'react';

interface Blog {
  title: string;
  content: string;
  published_at: string;
}

export default function BlogDetail({ blog, onBack }: { blog: Blog, onBack: () => void }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <button onClick={onBack} className="mb-8 flex items-center text-gray-400 hover:text-emerald-accent transition">
        <span className="mr-2">&larr;</span> Back to Blog
      </button>
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-white">{blog.title}</h1>
      <p className="text-gray-500 mb-10">{new Date(blog.published_at).toLocaleDateString()}</p>
      
      <div className="prose prose-invert prose-emerald max-w-none">
        {blog.content}
      </div>
    </div>
  );
}
