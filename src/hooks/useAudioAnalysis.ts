import { useState, useEffect } from 'react';

export const useAudioAnalysis = (audioFile: File | null) => {
  const [tempo, setTempo] = useState<number | null>(null);
  const [beats, setBeats] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!audioFile) {
      setTempo(null);
      setBeats([]);
      return;
    }

    const analyzeAudio = async () => {
      setIsAnalyzing(true);
      
      try {
        const audioContext = new AudioContext();
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          if (!e.target?.result) return;
          
          const audioBuffer = await audioContext.decodeAudioData(e.target.result as ArrayBuffer);
          
          // Simple tempo detection based on peak analysis
          const channelData = audioBuffer.getChannelData(0);
          const sampleRate = audioBuffer.sampleRate;
          
          // Detect peaks in the waveform
          const peaks = detectPeaks(channelData);
          const averageInterval = calculateAverageInterval(peaks, sampleRate);
          
          // Convert interval to BPM
          const detectedTempo = 60 / (averageInterval / sampleRate);
          
          setTempo(detectedTempo);
          setBeats(peaks);
          setIsAnalyzing(false);
        };
        
        reader.readAsArrayBuffer(audioFile);
      } catch (error) {
        console.error('Error analyzing audio:', error);
        setIsAnalyzing(false);
      }
    };

    analyzeAudio();
  }, [audioFile]);

  return { tempo, beats, isAnalyzing };
};

// Helper functions for peak detection
const detectPeaks = (channelData: Float32Array): number[] => {
  const peaks: number[] = [];
  const threshold = 0.5;
  
  for (let i = 1; i < channelData.length - 1; i++) {
    if (
      channelData[i] > threshold &&
      channelData[i] > channelData[i - 1] &&
      channelData[i] > channelData[i + 1]
    ) {
      peaks.push(i);
    }
  }
  
  return peaks;
};

const calculateAverageInterval = (peaks: number[], sampleRate: number): number => {
  if (peaks.length < 2) return 0;
  
  const intervals: number[] = [];
  for (let i = 1; i < peaks.length; i++) {
    intervals.push(peaks[i] - peaks[i - 1]);
  }
  
  return intervals.reduce((a, b) => a + b) / intervals.length;
};