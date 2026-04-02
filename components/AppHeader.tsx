'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
}

export function AppHeader({ title, showBack = false }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header
      dir="rtl"
      className="w-full h-14 bg-transparent flex items-center justify-between px-4"
    >
      {showBack ? (
        <Button
          id="header-back-btn"
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      ) : (
        <div className="w-9" />
      )}

      <h1 className="text-sm font-bold text-foreground">{title}</h1>

      <ThemeToggle />
    </header>
  );
}
