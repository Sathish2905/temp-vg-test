import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MediaUploader } from './components/MediaUploader';
import { VideoPreview } from './components/VideoPreview';
import { DynamicTemplatePreview } from './components/DynamicTemplatePreview';
import { AudioTrimmer } from './components/AudioTrimmer';
import { TemplateInfo } from './components/TemplateInfo';
import { useAudioAnalysis } from './hooks/useAudioAnalysis';
import { generateVideoFrames, createVideo } from './utils/videoGenerator';

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(60);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);
  
  const { tempo, beats, isAnalyzing } = useAudioAnalysis(audioFile);

  useEffect(() => {
    if (audioFile) {
      const audio = new Audio(URL.createObjectURL(audioFile));
      audio.onloadedmetadata = () => {
        setAudioDuration(audio.duration);
        setTrimEnd(Math.min(60, audio.duration));
      };
    }
  }, [audioFile]);

  const handleGenerate = async () => {
    if (!audioFile || images.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    setStatus('Preparing frames...');

    try {
      // Generate video frames
      const frames = generateVideoFrames(
        images,
        beats,
        audioDuration,
        tempo,
        trimStart,
        trimEnd
      );

      // Create video from frames
      const videoBlob = await createVideo(frames, (progress, status) => {
        setProgress(progress);
        setStatus(status);
      });

      // Create URL for the video
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
    } catch (error) {
      console.error('Error generating video:', error);
      setStatus('Error generating video');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="space-y-8">
            <MediaUploader
              audioFile={audioFile}
              images={images}
              onAudioUpload={setAudioFile}
              onImagesUpload={setImages}
              isAnalyzing={isAnalyzing}
              tempo={tempo}
            />

            {audioFile && audioDuration > 0 && (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">Trim Audio</h2>
                <AudioTrimmer
                  audioFile={audioFile}
                  onTrimChange={(start, end) => {
                    setTrimStart(start);
                    setTrimEnd(end);
                  }}
                  duration={audioDuration}
                />
              </div>
            )}
          </div>

          <div className="space-y-8">
            <DynamicTemplatePreview
              images={images}
              beats={beats}
              tempo={tempo}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            />

            {tempo && (
              <TemplateInfo
                template={tempo > 100 ? 'dynamic' : 'static'}
                tempo={tempo}
                duration={trimEnd - trimStart}
              />
            )}

            <VideoPreview
              url={videoUrl}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              disabled={!audioFile || images.length === 0}
              progress={progress}
              status={status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;