'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Listing } from '@/lib/types';

const FALLBACK = 'https://raiyansoft.com/wp-content/uploads/2026/01/1.png';

interface Props { listing: Listing }

export function MediaCarousel({ listing }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mediaItems = [
    ...listing.images.map((src, i) => ({ type: 'image' as const, src, id: `img-${i}` })),
    ...(listing.video ? [{ type: 'video' as const, src: listing.video, id: 'vid' }] : []),
  ];

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const width = e.currentTarget.offsetWidth;
    const idx = Math.round(Math.abs(e.currentTarget.scrollLeft) / width);
    setActiveIdx(idx);
  }, []);

  const scrollTo = (idx: number) => {
    setActiveIdx(idx);
    const child = scrollRef.current?.children[idx] as HTMLElement;
    child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="flex flex-col">
      {/* Main Carousel */}
      <div className="relative w-full pt-[100%] bg-muted overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {mediaItems.map((item, idx) => (
            <div key={item.id} className="relative w-full h-full shrink-0 snap-center bg-black flex items-center justify-center">
              {item.type === 'video' ? (
                <video src={item.src} controls playsInline className="w-full h-full object-contain" poster={FALLBACK} />
              ) : (
                <Image src={item.src} alt={`صورة ${idx + 1}`} fill className="object-cover" sizes="430px" />
              )}
            </div>
          ))}
        </div>
        {/* Counter badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10 z-10 pointer-events-none">
          {activeIdx + 1} / {mediaItems.length}
        </div>
      </div>

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar border-b border-border bg-card">
          {mediaItems.map((item, idx) => (
            <button
              key={`thumb-${item.id}`}
              id={`thumb-${idx}`}
              onClick={() => scrollTo(idx)}
              aria-label={`الذهاب إلى ${item.type === 'video' ? 'الفيديو' : 'الصورة'} رقم ${idx + 1}`}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                activeIdx === idx ? 'border-primary ring-1 ring-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="w-5 h-5 text-foreground" />
                </div>
              ) : (
                <Image src={item.src} alt={`مصغّر ${idx + 1}`} fill className="object-cover" sizes="64px" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
