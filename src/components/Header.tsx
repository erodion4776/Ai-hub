import React from 'react';

interface HeaderProps {
  onLoginClick: () => void;
  user: any | null;
  onLogout: () => void;
  onNavChange: (page: string) => void;
}

export default function Header({ onLoginClick, user, onLogout, onNavChange }: HeaderProps) {
  return (
    <header className="py-6 px-6 flex justify-between items-center border-b border-gray-800">
      <div className="text-xl font-bold text-emerald-accent cursor-pointer" onClick={() => onNavChange('home')}>AI Tutorial Hub</div>
      <nav className="flex gap-4 items-center">
        <button onClick={() => onNavChange('roadmaps')} className="text-gray-300 hover:text-white">Roadmaps</button>
        {user ? (
          <button onClick={onLogout} className="text-gray-300 hover:text-white">Logout</button>
        ) : (
          <button onClick={onLoginClick} className="bg-emerald-accent text-midnight px-4 py-2 rounded-lg font-bold hover:bg-emerald-600 transition">Login</button>
        )}
      </nav>
    </header>
  );
}
