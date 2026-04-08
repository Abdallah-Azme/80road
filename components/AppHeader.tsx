'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from '@/shared/components/Logo';

const NotificationBell = dynamic(
  () => import('@/features/notifications/components/NotificationBell').then(mod => mod.NotificationBell),
  { ssr: false, loading: () => <div className="w-10 h-10" /> }
);

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

      {title === '80road' ? (
        <Logo width={32} height={32} />
      ) : (
        <h1 className="text-base md:text-lg font-bold text-foreground">{title}</h1>
      )}
      <div className="flex items-center gap-2">
        <NotificationBell unreadCount={2} />
        <ThemeToggle />
      </div>
    </header>
  );
}
