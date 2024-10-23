import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioFile: File;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioFile }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target?.result) return;
      
      const audioBuffer = await audioContext.decodeAudioData(e.target.result as ArrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#c084fc');
        gradient.addColorStop(1, '#ec4899');

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          
          x += barWidth;
        }
      };

      draw();
    };

    reader.readAsArrayBuffer(audioFile);

    return () => {
      audioContext.close();
    };
  }, [audioFile]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24 mt-4 rounded-lg bg-black/20"
      width={800}
      height={100}
    />
  );
};