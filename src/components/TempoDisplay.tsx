import React from 'react';
import { Music } from 'lucide-react';

interface TempoDisplayProps {
  tempo: number | null;
  isAnalyzing: boolean;
}

export const TempoDisplay: React.FC<TempoDisplayProps> = ({ tempo, isAnalyzing }) => {
  return (
    <div className="flex items-center space-x-2 text-gray-300">
      <Music className="w-4 h-4" />
      <span className="text-sm">
        {isAnalyzing ? 'Analyzing tempo...' : tempo ? `${Math.round(tempo)} BPM` : 'No tempo detected'}
      </span>
    </div>
  );
};