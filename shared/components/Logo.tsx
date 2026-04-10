"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  /** Show the "80road" text label next to the logo image. Defaults to true. */
  showText?: boolean;
}

export function Logo({
  className,
  imageClassName,
  width = 60,
  height = 60,
  showText = true,
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden transition-transform group-hover:scale-105 active:scale-95",
          imageClassName,
        )}
      >
        <Image
          src="/road-logo.webp"
          alt="80road"
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className="font-black text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">
          80road
        </span>
      )}
    </Link>
  );
}
