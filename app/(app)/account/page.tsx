'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore } from '@/stores/user.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { DEMO_ADS } from '@/features/home/services/listings.service';
import { HomeListingCard } from '@/features/home/components/HomeListingCard';
import { Button } from '@/components/ui/button';
import { Settings, Heart, LayoutGrid, BadgeCheck, Phone, MessageCircle, Edit, MapPin, Globe, Link2 } from 'lucide-react';

// Instagram icon (not in this lucide version)
function InstagramIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);
}
function TikTokIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.19 8.19 0 004.79 1.53V6.85a4.85 4.85 0 01-1.02-.16z"/></svg>);
}

// Snapchat icon
function SnapchatIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.065 2C9.02 2 6.539 4.43 6.539 7.414v.843l-.86.215c-.293.073-.52.297-.587.586l-.2.87c-.087.38.1.77.462.944l.863.41-.35.96c-.75 2.057-2.47 3.187-2.55 3.237a.648.648 0 00-.2.9c.18.274.504.394.82.3.44-.128 1.086-.3 1.565-.126l.03.01c.415.154.783.454 1.26.74.857.512 1.868.774 2.888.757.193 0 .386-.01.578-.03.6.016 1.185.187 1.701.498.48.288.847.59 1.262.743l.03.01c.48.174 1.125.002 1.565-.126.315-.094.64.026.82.3a.648.648 0 00-.2-.9c-.08-.05-1.8-1.18-2.55-3.237l-.35-.96.863-.41c.362-.174.549-.564.462-.944l-.2-.87a.726.726 0 00-.587-.586l-.86-.215v-.843C17.461 4.43 14.98 2 11.935 2h.13z"/></svg>);
}
import Link from 'next/link';
import type { Listing } from '@/lib/types';

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-lg font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function MyProfilePage() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { ids: favorites } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<'ads' | 'favorites'>('ads');

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user) return null;

  const myAds: Listing[] = DEMO_ADS.filter(l => l.publisherId === 'current_user');
  const favListings: Listing[] = DEMO_ADS.filter(l => favorites.includes(l.id));
  const displayList = activeTab === 'ads' ? myAds : favListings;

  const stats = {
    ads:   myAds.length.toString(),
    likes: '27',
    views: '1,240',
  };

  return (
    <div className="flex flex-col min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-xl"
        style={{ height: '56px', paddingTop: 'env(safe-area-inset-top)' }}
      >
        <h1 className="text-sm font-bold">حسابي</h1>
        <div className="flex items-center gap-2">
          <Link href="/quick-start?mode=edit" id="profile-edit-prefs"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Edit className="w-4 h-4" />
          </Link>
          <button id="profile-settings"
            onClick={() => { logout(); router.push('/auth'); }}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col p-4 gap-6 pb-28">
        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full bg-muted border-2 border-card shadow-md overflow-hidden shrink-0 flex items-center justify-center">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name ?? ''} fill className="object-cover" />
            ) : (
              <span className="text-2xl text-muted-foreground select-none">
                {(user.name ?? 'م').charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold">{user.name ?? 'مستخدم'}</h2>
              <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">وسيط عقاري معتمد. خبرة في السوق.</p>
            <p className="text-xs text-muted-foreground">{user.phone}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center px-4 py-4 bg-card rounded-2xl shadow-sm border border-border">
          <StatItem label="الإعلانات" value={stats.ads}   />
          <div className="w-px h-8 bg-border" />
          <StatItem label="اللايكات"  value={stats.likes} />
          <div className="w-px h-8 bg-border" />
          <StatItem label="المشاهدات" value={stats.views} />
        </div>

        {/* Quick CTA */}
        <div className="flex gap-3">
          <a href="https://wa.me/96598812020" target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button id="me-whatsapp" variant="outline" className="w-full gap-2">
              <MessageCircle className="w-5 h-5" /> واتساب
            </Button>
          </a>
          <a href="tel:+96598812020" className="flex-1">
            <Button id="me-call" className="w-full gap-2 shadow-lg shadow-primary/20">
              <Phone className="w-5 h-5" /> اتصال
            </Button>
          </a>
        </div>

        {/* Social icon row — 6 icons matching legacy */}
        <div className="flex justify-center gap-3">
          {([
            { id: 'me-instagram', href: 'https://instagram.com/', Icon: InstagramIcon },
            { id: 'me-tiktok',    href: 'https://tiktok.com/',    Icon: TikTokIcon },
            { id: 'me-snapchat', href: 'https://snapchat.com/',  Icon: SnapchatIcon },
            { id: 'me-maps',     href: 'https://maps.google.com/', Icon: MapPin },
            { id: 'me-globe',    href: 'https://example.com/',   Icon: Globe },
            { id: 'me-link',     href: 'https://example.com/',   Icon: Link2 },
          ] as const).map(({ id, href, Icon }) => (
            <a key={id} id={id} href={href} target="_blank" rel="noopener noreferrer"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all">
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-muted rounded-xl">
          <button
            id="profile-tab-ads"
            onClick={() => setActiveTab('ads')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'ads'
                ? 'bg-card shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            إعلاناتي
          </button>
          <button
            id="profile-tab-favs"
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'favorites'
                ? 'bg-card shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            مفضلتي
          </button>
        </div>

        {/* Listings grid */}
        {displayList.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-muted-foreground text-sm">
            {activeTab === 'ads' ? 'لا توجد إعلانات. أضف إعلانك الأول!' : 'لا توجد عقارات في مفضلتك بعد.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayList.map((listing, i) => (
              <HomeListingCard key={`${listing.id}-${i}`} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
