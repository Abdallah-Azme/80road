import type { Metadata } from 'next';
import Image from 'next/image';
import { BadgeCheck, Phone, MessageCircle, Globe, MapPin, Link2 } from 'lucide-react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchOfficeById } from '@/features/companies/services/offices.service';
import { DEMO_ADS } from '@/features/home/services/listings.service';
import { HomeListingCard } from '@/features/home/components/HomeListingCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);
}
function TikTokIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.19 8.19 0 004.79 1.53V6.85a4.85 4.85 0 01-1.02-.16z"/></svg>);
}
function SnapchatIcon({ className }: { className?: string }) {
  return (<svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.065 2C9.02 2 6.539 4.43 6.539 7.414v.843l-.86.215c-.293.073-.52.297-.587.586l-.2.87c-.087.38.1.77.462.944l.863.41-.35.96c-.75 2.057-2.47 3.187-2.55 3.237a.648.648 0 00-.2.9c.18.274.504.394.82.3.44-.128 1.086-.3 1.565-.126l.03.01c.415.154.783.454 1.26.74.857.512 1.868.774 2.888.757.193 0 .386-.01.578-.03.6.016 1.185.187 1.701.498.48.288.847.59 1.262.743l.03.01c.48.174 1.125.002 1.565-.126.315-.094.64.026.82.3a.648.648 0 00-.2-.9c-.08-.05-1.8-1.18-2.55-3.237l-.35-.96.863-.41c.362-.174.549-.564.462-.944l-.2-.87a.726.726 0 00-.587-.586l-.86-.215v-.843C17.461 4.43 14.98 2 11.935 2h.13z"/></svg>);
}

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const office = await fetchOfficeById(id);
  return {
    title: office ? `${office.officeName} | 80road` : 'ملف المستخدم | 80road',
  };
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-lg font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.offices.detail(id),
    queryFn: () => fetchOfficeById(id),
  });

  const office = queryClient.getQueryData<Awaited<ReturnType<typeof fetchOfficeById>>>(
    QUERY_KEYS.offices.detail(id)
  );

  const listings = office
    ? office.sampleListings
    : DEMO_ADS.filter(l => l.publisherId === id);

  const name     = office?.officeName ?? 'ناشر الإعلان';
  const bio      = office?.bio        ?? 'عضو في 80road';
  const avatar   = office?.logo       ?? null;
  const verified = office?.verified   ?? false;
  const stats = {
    ads:    (office?.activeListingsCount ?? listings.length).toString(),
    views:  (office?.totalViews         ?? 0).toLocaleString(),
    rating: (office?.rating             ?? 0).toString(),
  };

  const contacts = [
    { href: `https://wa.me/${office?.whatsapp ?? ''}`,  Icon: MessageCircle, id: 'profile-wa'        },
    { href: `tel:${office?.phone ?? ''}`,               Icon: Phone,         id: 'profile-tel'       },
    { href: 'https://instagram.com/',                   Icon: InstagramIcon, id: 'profile-instagram' },
    { href: 'https://tiktok.com/',                      Icon: TikTokIcon,    id: 'profile-tiktok'   },
    { href: 'https://snapchat.com/',                    Icon: SnapchatIcon,  id: 'profile-snapchat' },
    { href: 'https://maps.google.com/',                 Icon: MapPin,        id: 'profile-maps'     },
    { href: 'https://example.com',                      Icon: Globe,         id: 'profile-web'      },
    { href: 'https://example.com/link',                 Icon: Link2,         id: 'profile-link'     },
  ];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-background animate-in fade-in duration-300">

        {/* Back header - Mobile Only */}
        <div
          className="md:hidden sticky top-0 z-20 flex items-center px-4 bg-background/80 backdrop-blur-xl border-b border-border"
          style={{ height: '56px', paddingTop: 'env(safe-area-inset-top)' }}
          dir="rtl"
        >
          <Link href="/" id="profile-back" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Link>
          <h1 className="flex-1 text-center text-sm font-bold pr-9">الملف التعريفي</h1>
        </div>

        {/* Profile Content Container */}
        <div className="md:container md:mx-auto md:px-4 lg:px-8 py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12" dir="rtl">
            
            {/* Sidebar (4 columns on desktop) - Profile Info */}
            <div className="md:col-span-4 order-1">
              <div className="md:sticky md:top-24 flex flex-col gap-6 md:gap-8 px-5 md:px-0">
                
                {/* User Card */}
                <div className="bg-card md:rounded-3xl rounded-3xl p-6 md:p-8 shadow-lg shadow-primary/5 border border-border flex flex-col items-center text-center gap-4">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted">
                    {avatar
                      ? <Image src={avatar} alt={name} fill className="object-cover" />
                      : <span className="w-full h-full flex items-center justify-center text-3xl text-muted-foreground">م</span>
                    }
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="text-xl md:text-2xl font-bold">{name}</h2>
                      {verified && <BadgeCheck className="w-5 h-5 text-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 md:grid-cols-1 md:divide-y md:divide-x-0 divide-x divide-rtl bg-card rounded-3xl shadow-sm border border-border p-4 md:p-6 text-center">
                  <div className="md:py-3"><StatItem label="الإعلانات" value={stats.ads} /></div>
                  <div className="md:py-3"><StatItem label="المشاهدات" value={stats.views} /></div>
                  <div className="md:py-3"><StatItem label="التقييم" value={stats.rating} /></div>
                </div>

                {/* Contact & Socials */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <a href={`https://wa.me/${office?.whatsapp ?? ''}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button id="profile-whatsapp" variant="outline" className="w-full h-11 md:h-12 gap-2 text-green-700 bg-green-50/50 border-green-100 hover:bg-green-100 transition-colors">
                        <MessageCircle className="w-5 h-5" /> واتساب
                      </Button>
                    </a>
                    <a href={`tel:${office?.phone ?? ''}`} className="flex-1">
                      <Button id="profile-call" className="w-full h-11 md:h-12 gap-2 shadow-lg shadow-primary/20">
                        <Phone className="w-5 h-5" /> اتصال
                      </Button>
                    </a>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {contacts.map(({ href, Icon, id: btnId }) => (
                      <a
                        key={btnId}
                        id={btnId}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-card border border-border text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5 active:scale-95 transition-all"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Area (8 columns on desktop) - Lists */}
            <div className="md:col-span-8 order-2 px-5 md:px-0">
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-xl font-bold">إعلانات {name}</h3>
                  <span className="text-sm text-muted-foreground font-medium">{stats.ads} إعلان متاح</span>
                </div>

                {listings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-3xl border border-dashed border-border">
                    <p className="text-sm">لا توجد إعلانات حالياً لهذا المستخدم</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {listings.map((listing, i) => (
                      <HomeListingCard key={`${listing.id}-${i}`} listing={listing} />
                    ))}
                  </div>
                )}
              </section>
            </div>

          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
