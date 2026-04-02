'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserStore } from '@/stores/user.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { DEMO_ADS } from '@/features/home/services/listings.service';
import { HomeListingCard } from '@/features/home/components/HomeListingCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
    <div className="flex flex-col min-h-screen bg-background pb-28 md:pb-10 pt-4" dir="rtl">
      {/* ── Main Layout: Responsive Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        
        {/* ── Right Column (Sidebar on Desktop): Profile Card ── */}
        <div className="lg:order-2">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Profile Info Card */}
            <div className="bg-card rounded-[2.5rem] p-6 shadow-xl shadow-primary/5 border border-border relative overflow-hidden">
               {/* Header Actions */}
               <div className="absolute top-6 left-6 flex items-center gap-2">
                  <Link href="/quick-start?mode=edit" id="profile-edit-prefs"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors border border-border/50 text-foreground">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button id="profile-settings"
                    onClick={() => { logout(); router.push('/auth'); }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive/20 text-destructive">
                    <Settings className="w-4 h-4" />
                  </button>
               </div>

               <div className="flex flex-col items-center text-center mt-4">
                  <div className="relative w-28 h-28 rounded-full bg-primary/5 border-4 border-card shadow-2xl overflow-hidden mb-4 flex items-center justify-center">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name ?? ''} fill className="object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-primary select-none">
                        {(user.name ?? 'م').charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-black text-foreground">{user.name ?? 'مستخدم'}</h2>
                    <BadgeCheck className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">وسيط عقاري معتمد • خبرة في السوق</p>
                  <p className="text-sm font-bold text-primary/80">{user.phone}</p>

                  {/* Social Icons Container */}
                  <div className="flex flex-wrap justify-center gap-2.5 mt-8">
                    {([
                      { id: 'me-instagram', href: 'https://instagram.com/', Icon: InstagramIcon },
                      { id: 'me-tiktok',    href: 'https://tiktok.com/',    Icon: TikTokIcon },
                      { id: 'me-snapchat', href: 'https://snapchat.com/',  Icon: SnapchatIcon },
                      { id: 'me-maps',     href: 'https://maps.google.com/', Icon: MapPin },
                      { id: 'me-globe',    href: 'https://example.com/',   Icon: Globe },
                      { id: 'me-link',     href: 'https://example.com/',   Icon: Link2 },
                    ] as const).map(({ id, href, Icon }) => (
                      <a key={id} id={id} href={href} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/30 border border-border/50 text-foreground/80 hover:text-primary hover:border-primary/30 hover:bg-primary/5 active:scale-95 transition-all">
                        <Icon className="w-4.5 h-4.5" />
                      </a>
                    ))}
                  </div>
               </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
              <h3 className="text-sm font-bold mb-4 px-1">تواصل سريع</h3>
              <div className="flex gap-3">
                <a href="https://wa.me/96598812020" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button id="me-whatsapp" variant="outline" className="w-full h-12 gap-2 rounded-2xl font-bold">
                    <MessageCircle className="w-5 h-5 text-green-500" /> واتساب
                  </Button>
                </a>
                <a href="tel:+96598812020" className="flex-1">
                  <Button id="me-call" className="w-full h-12 gap-2 rounded-2xl font-bold shadow-lg shadow-primary/10">
                    <Phone className="w-5 h-5" /> اتصال
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Left Column (Main Content): Stats + Listings ── */}
        <div className="lg:order-1 space-y-8">
          {/* Stats Summary Grid */}
          <div className="grid grid-cols-3 gap-4">
             {[
               { label: 'الإعلانات', value: stats.ads, color: 'bg-primary/10 text-primary' },
               { label: 'اللايكات',  value: stats.likes, color: 'bg-rose-500/10 text-rose-500' },
               { label: 'المشاهدات', value: stats.views, color: 'bg-amber-500/10 text-amber-500' }
             ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-3xl p-5 border border-border shadow-sm flex flex-col items-center text-center gap-1">
                   <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2", stat.color)}>
                     نشط
                   </span>
                   <span className="text-3xl font-black">{stat.value}</span>
                   <span className="text-xs font-bold text-muted-foreground">{stat.label}</span>
                </div>
             ))}
          </div>

          {/* Listings Section */}
          <div className="space-y-6">
            {/* Horizontal Tabs: Premium Underline Style */}
            <div className="flex items-center gap-8 border-b border-border/60 px-2">
              {[
                { id: 'ads', label: 'إعلاناتي', icon: LayoutGrid },
                { id: 'favorites', label: 'مفضلتي', icon: Heart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`profile-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as 'ads' | 'favorites')}
                  className={cn(
                    "relative pb-4 text-sm font-black transition-all flex items-center gap-2",
                    activeTab === tab.id 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "fill-primary/10" : "")} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(var(--primary),0.3)] animate-in fade-in slide-in-from-bottom-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Responsive Grid */}
            {displayList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-muted/30 rounded-[2.5rem] border-2 border-dashed border-border/50 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-4 opacity-50">
                   {activeTab === 'ads' ? <LayoutGrid className="w-8 h-8" /> : <Heart className="w-8 h-8" />}
                </div>
                <p className="font-bold text-base">
                  {activeTab === 'ads' ? 'لا توجد إعلانات حالياً' : 'مفضلتي فارغة'}
                </p>
                <p className="text-sm opacity-60">
                   {activeTab === 'ads' ? 'ابدأ الآن وأضف إعلانك الأول!' : 'تصفح العقارات وأضف ما يعجبك للمفضلة'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 2xl:gap-6">
                {displayList.map((listing, i) => (
                  <HomeListingCard key={`${listing.id}-${i}`} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
