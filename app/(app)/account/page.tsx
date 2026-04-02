'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore } from '@/stores/user.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { DEMO_ADS } from '@/features/home/services/listings.service';
import { HomeListingCard } from '@/features/home/components/HomeListingCard';
import { Button } from '@/components/ui/button';
import { Settings, Heart, LayoutGrid, BadgeCheck, Phone, MessageCircle, Edit } from 'lucide-react';
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
