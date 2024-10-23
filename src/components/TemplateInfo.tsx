import React from 'react';
import { Clock, Image as ImageIcon } from 'lucide-react';

interface TemplateInfoProps {
  template: 'dynamic' | 'static';
  tempo: number | null;
  duration: number;
}

export const TemplateInfo: React.FC<TemplateInfoProps> = ({
  template,
  tempo,
  duration,
}) => {
  const getTemplateRequirements = () => {
    if (template === 'dynamic') {
      const imagesNeeded = 6;
      const secondsPerImage = Math.floor(duration / imagesNeeded);
      return { imagesNeeded, secondsPerImage };
    } else {
      const imagesNeeded = 4;
      const secondsPerImage = Math.floor(duration / imagesNeeded);
      return { imagesNeeded, secondsPerImage };
    }
  };

  const { imagesNeeded, secondsPerImage } = getTemplateRequirements();

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 space-y-3">
      <h3 className="text-lg font-semibold text-white">Template Requirements</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-5 h-5 text-purple-400" />
          <span className="text-gray-300">
            {imagesNeeded} images needed
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-purple-400" />
          <span className="text-gray-300">
            {secondsPerImage}s per image
          </span>
        </div>
      </div>

      {tempo && (
        <div className="text-sm text-gray-400">
          Template optimized for {Math.round(tempo)} BPM
        </div>
      )}
    </div>
  );
};