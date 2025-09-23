// components/TestCarousel.tsx
'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

export default function TestCarousel() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 'auto', spacing: 16 },
    loop: false,
  });

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Carrusel de prueba</h3>
      <div ref={sliderRef} className="keen-slider overflow-x-auto hide-scrollbar">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="keen-slider__slide min-w-[200px] bg-orange-100 rounded-lg flex items-center justify-center text-orange-800 font-bold text-lg"
          >
            Slide {i}
          </div>
        ))}
      </div>
    </div>
  );
}