import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient.ts';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
}

interface BlogProps {
  onBlogSelect: (blog: Blog) => void;
}

export default function Blog({ onBlogSelect }: BlogProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const supabase = getSupabase();
      if (!supabase) return;
      
      // NOTE: User must create 'blog_posts' table in Supabase
      const { data, error } = await supabase.from('blog_posts').select('*');
      if (data) setBlogs(data);
    }
    fetchBlogs();
  }, []);

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="group bg-gray-900/50 border border-gray-800 p-8 rounded-2xl cursor-pointer hover:border-emerald-accent/50 hover:shadow-2xl hover:shadow-emerald-accent/10 transition-all duration-300" onClick={() => onBlogSelect(blog)}>
            <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-accent transition duration-300">{blog.title}</h2>
            <p className="text-gray-400 leading-relaxed mb-4">{blog.excerpt}</p>
            <span className="text-emerald-accent font-semibold">Read more</span>
          </div>
        ))}
      </div>
    </div>
  );
}
