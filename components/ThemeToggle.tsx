'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui.store';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  // Sync class on first mount (covers SSR hydration)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Button
      id="theme-toggle"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="تبديل المظهر"
      className="w-10 h-10 rounded-full"
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </Button>
  );
}
