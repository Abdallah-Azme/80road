'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop',
    alt: 'شقة فاخرة للإيجار',
    label: 'أفضل شقق الكويت',
    title: 'استمتع بالرفاهية في قلب الكويت',
  },
  {
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    alt: 'فيلا للبيع',
    label: 'فلل بتصاميم عصرية',
    title: 'فلل مودرن تناسب تطلعاتك',
  },
  {
    src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
    alt: 'عمارة استثمارية',
    label: 'فرص استثمارية مميزة',
    title: 'استثمارك الآمن يبدأ من هنا',
  },
];

export function BannerSlider() {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const next = useCallback(() => setIndex(i => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex(i => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div
      dir="rtl"
      className="relative w-full md:rounded-[40px] overflow-hidden select-none aspect-video md:aspect-3/1 lg:aspect-4/1 xl:aspect-5/1 shadow-2xl border border-border/60 group"
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
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            className="w-full h-full object-cover will-change-transform transition-transform duration-[5s] group-hover:scale-110"
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : "auto"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Label & Title with Hierarchy */}
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end text-white">
            <div className="flex flex-col gap-2 max-w-2xl transform transition-transform duration-1000 translate-y-0" style={{ transform: i === index ? 'translateY(0)' : 'translateY(20px)' }}>
              <span className="w-fit px-4 py-1.5 bg-primary/90 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                {s.label}
              </span>
              <h2 className="text-3xl md:text-5xl font-black md:tracking-tighter drop-shadow-2xl leading-none">
                {s.title}
              </h2>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10 p-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`الذهاب للشريحة ${i + 1}`}
            onClick={() => setIndex(i)}
            className="group relative p-2"
          >
            <div className={`rounded-full transition-all duration-300 ${
              i === index ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 group-hover:bg-white/80'
            }`} />
          </button>
        ))}
      </div>

      {/* Prev / Next arrows (RTL mapped) */}
      <button
        onClick={next}
        aria-label="الشريحة التالية"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center z-10 active:scale-90 transition-all hover:bg-black/60 shadow-lg"
      ><ChevronLeft className="w-6 h-6 -translate-x-px" /></button>
      <button
        onClick={prev}
        aria-label="الشريحة السابقة"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center z-10 active:scale-90 transition-all hover:bg-black/60 shadow-lg"
      ><ChevronRight className="w-6 h-6 translate-x-px" /></button>
    </div>
  );
}
