'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=900&auto=format&fit=crop',
    alt: 'شقة فاخرة للإيجار',
    label: 'أفضل شقق الكويت',
  },
  {
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=900&auto=format&fit=crop',
    alt: 'فيلا للبيع',
    label: 'فلل بتصاميم عصرية',
  },
  {
    src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=900&auto=format&fit=crop',
    alt: 'عمارة استثمارية',
    label: 'فرص استثمارية مميزة',
  },
];

export function BannerSlider() {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const next = useCallback(() => setIndex(i => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex(i => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const t = setInterval(next, 3000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div
      dir="rtl"
      className="relative w-full rounded-2xl overflow-hidden select-none aspect-2.2/1 md:aspect-3/1 lg:aspect-4/1"
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const diff = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { if (diff < 0) { prev(); } else { next(); } }
        touchX.current = null;
      }}
    >
      {/* Slides */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.alt}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
          {/* Label */}
          <div className="absolute bottom-8 right-4 text-white">
            <p className="text-base font-bold drop-shadow-md">{s.label}</p>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`الشريحة ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === index ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="السابق"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full text-white flex items-center justify-center z-10 active:scale-90 transition-transform"
      >‹</button>
      <button
        onClick={next}
        aria-label="التالي"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full text-white flex items-center justify-center z-10 active:scale-90 transition-transform"
      >›</button>
    </div>
  );
}
