/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { getSupabase } from './lib/supabaseClient.ts';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import Discovery from './components/Discovery.tsx';
import VideoGrid from './components/VideoGrid.tsx';
import PremiumCTA from './components/PremiumCTA.tsx';
import AuthModal from './components/AuthModal.tsx';
import TutorialDetail from './components/TutorialDetail.tsx';
import Roadmaps from './components/Roadmaps.tsx';
import RoadmapDetail from './components/RoadmapDetail.tsx';
import Blog from './components/Blog.tsx';
import BlogDetail from './components/BlogDetail.tsx';
import ToolsHub from './components/tools/ToolsHub.tsx';
import ImageGenerator from './components/tools/ImageGenerator.tsx';
import TextToSpeech from './components/tools/TextToSpeech.tsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  function renderContent() {
    if (selectedVideo) {
      return <TutorialDetail video={selectedVideo} onBack={() => setSelectedVideo(null)} />;
    }
    if (selectedRoadmap) {
      return <RoadmapDetail roadmap={selectedRoadmap} onBack={() => setSelectedRoadmap(null)} />;
    }
    if (selectedBlog) {
      return <BlogDetail blog={selectedBlog} onBack={() => setSelectedBlog(null)} />;
    }
    if (selectedTool) {
      const backToHub = () => setSelectedTool(null);
      switch (selectedTool) {
        case 'image-generator':
          return (
            <div>
              <button onClick={backToHub} className="ml-6 mt-6 text-gray-400 hover:text-white">&larr; Back to Tools</button>
              <ImageGenerator />
            </div>
          );
        case 'text-to-speech':
          return (
            <div>
              <button onClick={backToHub} className="ml-6 mt-6 text-gray-400 hover:text-white">&larr; Back to Tools</button>
              <TextToSpeech />
            </div>
          );
        default:
          return <ToolsHub onToolSelect={setSelectedTool} />;
      }
    }
    switch (currentPage) {
      case 'roadmaps':
        return <Roadmaps onRoadmapSelect={setSelectedRoadmap} />;
      case 'blog':
        return <Blog onBlogSelect={setSelectedBlog} />;
      case 'tools':
        return <ToolsHub onToolSelect={setSelectedTool} />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <Discovery />
            <VideoGrid onVideoSelect={setSelectedVideo} />
            <PremiumCTA />
          </>
        );
    }
  }

  return (
    <div className="min-h-screen bg-midnight text-white">
      <Header onLoginClick={() => setShowAuthModal(true)} user={user} onLogout={handleLogout} onNavChange={(page) => {
        setCurrentPage(page);
        setSelectedVideo(null);
        setSelectedRoadmap(null);
        setSelectedBlog(null);
        setSelectedTool(null);
      }} />
      {renderContent()}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
