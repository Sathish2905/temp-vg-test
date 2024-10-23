import { getTemplateForTempo } from './templateUtils';

export interface VideoFrame {
  images: string[];
  timestamp: number;
  template: 'dynamic' | 'static';
  beatIndex: number;
}

export const generateVideoFrames = (
  images: string[],
  beats: number[],
  duration: number,
  tempo: number | null,
  trimStart: number,
  trimEnd: number
): VideoFrame[] => {
  const template = getTemplateForTempo(tempo);
  const fps = 30;
  const frames: VideoFrame[] = [];
  const trimmedDuration = trimEnd - trimStart;
  
  // Calculate total frames needed
  const totalFrames = Math.ceil(trimmedDuration * fps);
  
  for (let i = 0; i < totalFrames; i++) {
    const timestamp = trimStart + (i / fps);
    const currentBeat = beats.findIndex(beat => beat >= timestamp);
    
    frames.push({
      images: images.slice(0, template === 'dynamic' ? 6 : 4),
      timestamp,
      template,
      beatIndex: currentBeat,
    });
  }
  
  return frames;
};

export const createVideo = async (
  frames: VideoFrame[],
  onProgress: (progress: number, status: string) => void
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;
  
  // Initialize MediaRecorder
  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5000000,
  });
  
  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
  
  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
    
    mediaRecorder.onerror = reject;
    mediaRecorder.start(1000);
    
    let frameIndex = 0;
    const totalFrames = frames.length;
    
    const renderFrame = async () => {
      if (frameIndex >= totalFrames) {
        mediaRecorder.stop();
        return;
      }
      
      const frame = frames[frameIndex];
      await drawFrame(ctx, frame);
      
      onProgress(
        (frameIndex / totalFrames) * 100,
        `Rendering frame ${frameIndex + 1}/${totalFrames}`
      );
      
      frameIndex++;
      requestAnimationFrame(renderFrame);
    };
    
    renderFrame();
  });
};

const drawFrame = async (
  ctx: CanvasRenderingContext2D,
  frame: VideoFrame
): Promise<void> => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  const images = await Promise.all(
    frame.images.map(src => loadImage(src))
  );
  
  if (frame.template === 'dynamic') {
    drawDynamicTemplate(ctx, images, frame.beatIndex);
  } else {
    drawStaticTemplate(ctx, images);
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const drawDynamicTemplate = (
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  beatIndex: number
) => {
  const cols = 3;
  const rows = 2;
  const padding = 10;
  const cellWidth = (ctx.canvas.width - padding * (cols + 1)) / cols;
  const cellHeight = (ctx.canvas.height - padding * (rows + 1)) / rows;
  
  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (cellWidth + padding);
    const y = padding + row * (cellHeight + padding);
    
    const scale = beatIndex % images.length === i ? 1.05 : 1;
    const scaledWidth = cellWidth * scale;
    const scaledHeight = cellHeight * scale;
    const offsetX = (scaledWidth - cellWidth) / 2;
    const offsetY = (scaledHeight - cellHeight) / 2;
    
    ctx.drawImage(
      img,
      x - offsetX,
      y - offsetY,
      scaledWidth,
      scaledHeight
    );
  });
};

const drawStaticTemplate = (
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[]
) => {
  const padding = 10;
  const width = (ctx.canvas.width - padding * 3) / 2;
  const height = (ctx.canvas.height - padding * 3) / 2;
  
  images.slice(0, 4).forEach((img, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = padding + col * (width + padding);
    const y = padding + row * (height + padding);
    
    ctx.drawImage(img, x, y, width, height);
  });
};