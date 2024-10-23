import React from 'react';
import { Play, Download } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface VideoPreviewProps {
  url: string | null;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
  progress: number;
  status: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  url,
  onGenerate,
  isGenerating,
  disabled,
  progress,
  status,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex justify-center gap-4">
        <button
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <Play className="w-5 h-5 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>

        {url && (
          <a
            href={url}
            download
            className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </a>
        )}
      </div>

      {isGenerating && (
        <div className="mt-6">
          <ProgressBar progress={progress} status={status} />
        </div>
      )}

      {url && (
        <div className="mt-6">
          <video controls className="w-full rounded-lg shadow-lg">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};