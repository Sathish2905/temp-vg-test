import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioTrimmerProps {
  audioFile: File;
  onTrimChange: (start: number, end: number) => void;
  duration: number;
}

export const AudioTrimmer: React.FC<AudioTrimmerProps> = ({
  audioFile,
  onTrimChange,
  duration,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(Math.min(60, duration));
  const [volume, setVolume] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const url = URL.createObjectURL(audioFile);
      audioRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFile]);

  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTrimChange = (type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      const newStart = Math.min(value, trimEnd - 10);
      setTrimStart(newStart);
      onTrimChange(newStart, trimEnd);
    } else {
      const newEnd = Math.max(value, trimStart + 10);
      setTrimEnd(newEnd);
      onTrimChange(trimStart, newEnd);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.currentTime = trimStart;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <div className="flex-1">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-2 bg-gray-700 rounded-full cursor-pointer relative"
          >
            <div
              className="absolute h-full bg-purple-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div
              className="absolute h-full bg-purple-300/30 rounded-full"
              style={{
                left: `${(trimStart / duration) * 100}%`,
                width: `${((trimEnd - trimStart) / duration) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-gray-300" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setVolume(value);
              if (audioRef.current) audioRef.current.volume = value;
            }}
            className="w-20"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Start Time (s)</label>
          <input
            type="number"
            min={0}
            max={trimEnd - 10}
            value={trimStart}
            onChange={(e) => handleTrimChange('start', Number(e.target.value))}
            className="w-20 px-2 py-1 rounded bg-gray-800 text-white border border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">End Time (s)</label>
          <input
            type="number"
            min={trimStart + 10}
            max={Math.min(60, duration)}
            value={trimEnd}
            onChange={(e) => handleTrimChange('end', Number(e.target.value))}
            className="w-20 px-2 py-1 rounded bg-gray-800 text-white border border-gray-700"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};