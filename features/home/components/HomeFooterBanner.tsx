'use client';

import Link from 'next/link';
import { useHomeData } from '@/shared/hooks/useHome';
import { CustomImage } from '@/shared/components/custom-image';

export function HomeFooterBanner() {
  const { data, isLoading } = useHomeData();
  const footers = data?.footer || [];

  if (isLoading) {
    return (
      <div className="w-full rounded-3xl overflow-hidden shadow-2xl aspect-[2.2/1] md:aspect-5/1 border border-border/20 bg-muted animate-pulse" />
    );
  }

  if (footers.length === 0) return null;

  // Render the first footer item (or ideally loop if it's a slider, but the original code had only one visible banner here)
  const footerData = footers[0];

  return (
    <div className="group relative w-full rounded-3xl overflow-hidden shadow-2xl aspect-[2.2/1] md:aspect-5/1 border border-border/20">
      <CustomImage
        src={footerData.image}
        fill
        alt={footerData.title}
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 1200px"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent flex items-center p-8 md:p-16">
        <div className="flex flex-col gap-2 md:gap-4 max-w-lg text-white">
          <h2 className="text-2xl md:text-4xl font-bold">{footerData.title}</h2>
          <p className="opacity-90">
            {footerData.description}
          </p>
          <Link 
            href={footerData.url || '/post-ad'}
            className="mt-2 w-fit px-6 py-3 bg-white text-navy rounded-xl font-bold hover:bg-white/90 transition-colors"
          >
            {footerData.button_action}
          </Link>
        </div>
      </div>
    </div>
  );
}
