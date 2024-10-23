import React, { useMemo } from 'react';
import { getTemplateForTempo } from '../utils/templateUtils';

interface DynamicTemplatePreviewProps {
  images: string[];
  beats: number[];
  tempo: number | null;
  className?: string;
}

export const DynamicTemplatePreview: React.FC<DynamicTemplatePreviewProps> = ({
  images,
  beats,
  tempo,
  className,
}) => {
  const template = useMemo(() => getTemplateForTempo(tempo), [tempo]);

  if (!images.length) {
    return (
      <div className={className}>
        <h2 className="text-2xl font-semibold text-white mb-4">Preview</h2>
        <div className="aspect-video rounded-lg bg-black/20 flex items-center justify-center">
          <p className="text-gray-400">Upload images to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold text-white mb-4">Preview</h2>
      <div className="aspect-video rounded-lg overflow-hidden bg-black/20">
        {template === 'dynamic' ? (
          <div className="grid grid-cols-3 grid-rows-2 gap-2 h-full p-2">
            {images.slice(0, 6).map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg transform transition-transform duration-200 hover:scale-105"
                style={{
                  animation: beats.length ? `pulse ${60 / (tempo || 120)}s infinite` : 'none',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 h-full p-2">
            {images.slice(0, 4).map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};