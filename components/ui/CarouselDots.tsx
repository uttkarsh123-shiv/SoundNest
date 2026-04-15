import React from 'react';

interface CarouselDotsProps {
  totalSlides: number;
  selectedIndex: number;
  onDotClick: (index: number) => void;
  className?: string;
}

const CarouselDots = ({ 
  totalSlides, 
  selectedIndex, 
  onDotClick,
  className = ""
}: CarouselDotsProps) => {
  return (
    <div className={`flex justify-center w-full mt-4 ${className}`}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 rounded-full transition-all mx-1 ${
            index === selectedIndex
              ? 'bg-green-1 w-6'
              : 'bg-white-1/30 hover:bg-white-1/50'
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselDots;