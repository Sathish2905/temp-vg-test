import React from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { TempoDisplay } from './TempoDisplay';

interface MediaUploaderProps {
  audioFile: File | null;
  images: string[];
  onAudioUpload: (file: File) => void;
  onImagesUpload: (urls: string[]) => void;
  isAnalyzing: boolean;
  tempo: number | null;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  audioFile,
  images,
  onAudioUpload,
  onImagesUpload,
  isAnalyzing,
  tempo,
}) => {
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onAudioUpload(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImagesUpload([...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Upload Media</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Audio Track</label>
          <label className="relative group cursor-pointer block">
            <div className="h-32 rounded-xl border-2 border-dashed border-purple-500/50 group-hover:border-purple-400 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 bg-purple-950/30">
              <Upload className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
              <span className="text-sm text-purple-300 group-hover:text-purple-200 transition-colors duration-200">
                {audioFile ? 'Change Audio' : 'Upload Audio'}
              </span>
            </div>
            <input type="file" className="hidden" accept="audio/*" onChange={handleAudioUpload} />
          </label>
          {audioFile && (
            <>
              <AudioVisualizer audioFile={audioFile} />
              <TempoDisplay tempo={tempo} isAnalyzing={isAnalyzing} />
            </>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Images</label>
          <label className="relative group cursor-pointer block">
            <div className="h-32 rounded-xl border-2 border-dashed border-pink-500/50 group-hover:border-pink-400 transition-colors duration-200 flex flex-col items-center justify-center space-y-2 bg-pink-950/30">
              <ImageIcon className="w-8 h-8 text-pink-400 group-hover:text-pink-300 transition-colors duration-200" />
              <span className="text-sm text-pink-300 group-hover:text-pink-200 transition-colors duration-200">
                Upload Images
              </span>
            </div>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {images.map((img, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};