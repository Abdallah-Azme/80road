'use client';

import * as React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface CustomImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = '/globe.svg'; // Minimal SVG fallback from public/

export function CustomImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  alt = 'image',
  width,
  height,
  fill,
  ...props
}: CustomImageProps) {
  const [error, setError] = React.useState(false);

  // If no src or error, use fallback
  const currentSrc = !src || error ? fallbackSrc : src;

  // Reset error state if src changes
  React.useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      onError={() => setError(true)}
      width={width}
      height={height}
      fill={fill}
      // Often API images are not pre-defined in remotePatterns OR
      // you want to skip next.config.ts check. unoptimized is safer.
      unoptimized={typeof currentSrc === 'string' && !currentSrc.startsWith('/')}
      {...props}
    />
  );
}
