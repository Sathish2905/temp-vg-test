import React from 'react';

interface VideoTemplateProps {
  images: string[];
  template: string;
  className?: string;
}

const VideoTemplate: React.FC<VideoTemplateProps> = ({ images, template, className }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'template1':
        return (
          <div className="grid grid-cols-2 gap-2 h-full">
            {images.slice(0, 4).map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <img src={img} alt={`Template ${index + 1}`} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        );
      case 'template2':
        return (
          <div className="grid grid-cols-3 gap-2 h-full">
            <div className="col-span-2 row-span-2">
              {images[0] && (
                <img src={images[0]} alt="Main" className="object-cover w-full h-full rounded-lg" />
              )}
            </div>
            <div>
              {images[1] && (
                <img src={images[1]} alt="Side 1" className="object-cover w-full h-full rounded-lg" />
              )}
            </div>
            <div>
              {images[2] && (
                <img src={images[2]} alt="Side 2" className="object-cover w-full h-full rounded-lg" />
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {images.length > 0 ? (
        renderTemplate()
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <p className="text-gray-500">Upload images to preview template</p>
        </div>
      )}
    </div>
  );
};

export default VideoTemplate;