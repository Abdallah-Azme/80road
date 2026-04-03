'use client';

import Link from 'next/link';

const ACTIONS = [
  {
    id: 'rent',
    label: 'إيجار',
    href: '/explore?type=rent',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
  {
    id: 'sale',
    label: 'بيع',
    href: '/explore?type=sale',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.169.659 1.59l9.581 9.581c.699.7 1.78.963 2.717.604a18.634 18.634 0 005.7-3.7 18.634 18.634 0 003.7-5.7c.358-.937.095-2.018-.604-2.717L14.659 3.66A2.25 2.25 0 0013.07 3H9.568z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  {
    id: 'hotels',
    label: 'فنادق',
    href: '/explore?type=hotels',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-center gap-3 md:gap-8" dir="rtl">
      {ACTIONS.map(action => (
        <Link
          key={action.id}
          href={action.href}
          id={`quick-action-${action.id}`}
          className="group flex flex-col items-center justify-center gap-2 md:gap-4 bg-card w-full md:w-44 lg:w-52 py-4 md:py-8 rounded-2xl md:rounded-3xl shadow-lg shadow-primary/5 border border-border/50 active:scale-95 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 focus-visible:ring-2 focus-visible:ring-ring outline-none"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:rotate-6 shadow-inner">
            {action.icon}
          </div>
          <span className="text-xs md:text-base font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
