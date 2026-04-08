'use client';

import Link from 'next/link';
import { Logo } from '@/shared/components/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { Search, PlusCircle, Home, Building2, Compass, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import dynamic from 'next/dynamic';

const NotificationBell = dynamic(
  () => import('@/features/notifications/components/NotificationBell').then(mod => mod.NotificationBell),
  { ssr: false, loading: () => <div className="w-10 h-10" /> }
);

const NAV_ITEMS = [
  { href: '/',          label: 'الرئيسية', Icon: Home,      id: 'header-home' },
  { href: '/companies', label: 'الشركات',  Icon: Building2, id: 'header-companies' },
  { href: '/explore',   label: 'اكسبلور',  Icon: Compass,   id: 'header-explore' },
  { href: '/account',   label: 'حسابي',    Icon: User,      id: 'header-account' },
];

export function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header
      dir="rtl"
      className={cn(
        'hidden md:flex items-center justify-center',
        'fixed top-0 right-0 left-0 z-50',
        'h-[72px] border-b border-border bg-background/80 backdrop-blur-xl shadow-sm'
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        <div className="flex items-center gap-8 h-full">
          {/* Brand Logo */}
          <Logo />
          
          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, id }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={id}
                  href={href}
                  className={cn(
                    'px-5 py-2 text-sm font-black transition-all rounded-full outline-none active:scale-95',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <Button
            id="desktop-header-search"
            variant="outline"
            className="items-center gap-2 text-muted-foreground text-sm rounded-full px-5 h-10 border-border hover:border-primary/30 transition-colors"
            onClick={() => router.push('/explore')}
          >
            <Search className="w-4 h-4" />
            ابحث عن عقار…
          </Button>

          {/* Post Ad CTA */}
          <Button
            id="desktop-header-post-ad"
            className="gap-2 h-10 px-5 rounded-full shadow-md shadow-primary/20"
            onClick={() => router.push('/post-ad')}
          >
            <PlusCircle className="w-4 h-4" />
            أضف إعلان
          </Button>
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
