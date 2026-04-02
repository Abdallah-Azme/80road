'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, PlusCircle, Home, Building2, Compass, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

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
        'hidden md:flex items-center justify-between',
        'fixed top-0 right-0 left-0 z-50',
        'h-[72px] px-6 border-b border-border bg-background/80 backdrop-blur-xl shadow-sm'
      )}
    >
      <div className="flex items-center gap-8 h-full">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary tracking-tight">80road</span>
        </Link>
        
        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center gap-2 h-full">
          {NAV_ITEMS.map(({ href, label, id }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={id}
                href={href}
                className={cn(
                  'flex items-center h-full px-4 text-sm font-semibold transition-colors border-b-2 outline-none',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
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
        
        <ThemeToggle />
      </div>
    </header>
  );
}
