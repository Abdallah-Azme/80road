'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export function Logo({ 
  className, 
  imageClassName,
  width = 40, 
  height = 40,
  showText = true 
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div className={cn(
        "relative rounded-xl overflow-hidden transition-transform group-hover:scale-105 active:scale-95",
        imageClassName
      )}>
        <Image
          src="/80road-logo.webp"
          alt="80road"
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className="text-xl md:text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
          80road
        </span>
      )}
    </Link>
  );
}
