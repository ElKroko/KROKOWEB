import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface YouTubeShortsCarouselProps {
  shortIds: string[];
}

const YouTubeShortsCarousel: React.FC<YouTubeShortsCarouselProps> = ({ shortIds }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? shortIds.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === shortIds.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="w-full">
      {/* Carrusel principal */}
      <div className="relative aspect-[9/16] w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-lg">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${shortIds[currentIndex]}?loop=1&controls=0&rel=0`}
          title={`YouTube Short ${currentIndex + 1}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Controles de navegación */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={handlePrev}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Anterior"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Siguiente"
          >
            <FaArrowRight />
          </button>
        </div>
        
        {/* Indicador de posición */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {shortIds.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex ? 'bg-accent-color' : 'bg-white/50'
              }`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ver short ${i + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Miniaturas */}
      <div className="flex justify-center mt-4 gap-2 overflow-x-auto pb-2">
        {shortIds.map((id, i) => (
          <button
            key={i}
            className={`w-16 h-24 relative rounded-md overflow-hidden border-2 transition-all ${
              i === currentIndex ? 'border-accent-color scale-110' : 'border-transparent opacity-70'
            }`}
            onClick={() => setCurrentIndex(i)}
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`}
              alt={`Miniatura ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default YouTubeShortsCarousel;