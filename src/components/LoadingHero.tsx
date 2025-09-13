import React, { useEffect, useState } from 'react';

const LoadingHero: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const slides = [
    {
      bgColor: 'bg-emerald-600',
      title: 'Production Yield',
      description: 'Maximize your dairy output with data-driven insights',
      textColor: 'text-white',
      icon: 'mdi:cow',
    },
    {
      bgColor: 'bg-amber-600',
      title: 'Farm Costs',
      description: 'Track and optimize every expense for better profitability',
      textColor: 'text-white',
      icon: 'mdi:cash-multiple',
    },
    {
      bgColor: 'bg-indigo-600',
      title: 'Scientific Insights',
      description: 'Proven methods backed by research and real farm data',
      textColor: 'text-white',
      icon: 'mdi:microscope',
    }
  ];

  useEffect(() => {
    // Custom durations for each slide (ms)
    const durations = [2000, 3000, 3000];
    let timeout: NodeJS.Timeout;

    function nextSlide(slideIdx: number) {
      if (slideIdx < slides.length - 1) {
        timeout = setTimeout(() => {
          setCurrentSlide(slideIdx + 1);
          nextSlide(slideIdx + 1);
        }, durations[slideIdx]);
      } else {
        // Last slide, wait then hide
        timeout = setTimeout(() => {
          setIsVisible(false);
          onComplete();
        }, durations[slideIdx]);
      }
    }

    nextSlide(0);
    return () => clearTimeout(timeout);
  }, [slides.length, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${slide.bgColor} ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <div className="text-center px-6 max-w-md flex flex-col items-center">
            <span className="iconify mb-4" data-icon={slide.icon} style={{ fontSize: 56, color: 'white' }}></span>
            <h1 className={`text-4xl font-bold mb-4 ${slide.textColor}`}>
              {slide.title}
            </h1>
            <p className={`text-xl ${slide.textColor} opacity-90`}>
              {slide.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingHero;
