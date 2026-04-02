'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, PlusCircle, Compass, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/',          label: 'الرئيسية', Icon: Home,      id: 'nav-home' },
  { href: '/companies', label: 'الشركات',  Icon: Building2, id: 'nav-companies' },
  { href: '/post-ad',   label: 'أضف إعلان',Icon: PlusCircle,id: 'nav-add',    special: true },
  { href: '/explore',   label: 'اكسبلور',  Icon: Compass,   id: 'nav-explore' },
  { href: '/account',   label: 'حسابي',    Icon: User,      id: 'nav-account' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      dir="rtl"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-card/90 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-end justify-around h-[var(--tab-h,60px)]">
        {NAV_ITEMS.map(({ href, label, Icon, id, special }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <li key={id} className="flex-1">
              <Link
                href={href}
                id={id}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 h-full transition-all duration-200 focus-visible:outline-none',
                  special
                    ? 'relative -top-3'
                    : 'active:scale-90'
                )}
              >
                {special ? (
                  <span className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </span>
                ) : (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        'text-[10px] font-semibold transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {label}
                    </span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
