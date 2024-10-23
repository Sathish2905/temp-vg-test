import React from 'react';
import { Music, Video } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <Music className="w-10 h-10 text-purple-400" />
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Rhythm Video Creator
        </h1>
        <Video className="w-10 h-10 text-pink-400" />
      </div>
      <p className="text-lg text-gray-300">
        Create dynamic videos that pulse with your music's rhythm
      </p>
    </header>
  );
};