import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchListingById } from '@/features/listing-detail/services/listing-detail.service';
import { MediaCarousel } from '@/features/listing-detail/components/MediaCarousel';
import { ContactBar } from '@/features/listing-detail/components/ContactBar';
import { ChevronRight, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(Number(id));
  return {
    title: listing ? `${listing.title} | 80road` : 'إعلان | 80road',
    description: listing?.description ?? '',
  };
}

function AttrBadge({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 flex flex-col gap-1 shadow-sm" dir="rtl">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export default async function AdPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.listings.detail(numericId),
    queryFn: () => fetchListingById(numericId),
  });

  const listing = queryClient.getQueryData<Awaited<ReturnType<typeof fetchListingById>>>(
    QUERY_KEYS.listings.detail(numericId)
  );

  if (!listing) notFound();

  const isOwner = listing.publisherId === 'current_user';

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col h-screen overflow-hidden bg-background animate-in fade-in duration-300">

        {/* Floating header over media */}
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4"
          style={{
            height: '56px',
            paddingTop: 'env(safe-area-inset-top)',
            background: 'linear-gradient(to bottom, rgba(0,0,0,.45) 0%, transparent 100%)',
          }}
        >
          <Link
            href="/"
            id="ad-back-btn"
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-all"
          >
            <ChevronRight className="w-6 h-6 rotate-180" />
          </Link>
          <button
            id="ad-favorite-btn"
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-red-300 active:scale-95 transition-all"
            aria-label="مفضلة"
          >
            <Heart className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-32">
          <MediaCarousel listing={listing} />

          <div className="flex flex-col gap-6 px-5 pt-4 pb-8" dir="rtl">
            {/* Title card */}
            <div className="bg-card rounded-3xl p-5 shadow-lg shadow-primary/5 border border-border">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-xl font-bold leading-snug max-w-[70%]">{listing.title}</h1>
                <span className="text-primary font-bold text-lg">{listing.price}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>{listing.area}، {listing.governorate}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Link
                  href={listing.publisherId ? `/profile/${listing.publisherId}` : '#'}
                  className="flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <div className="w-8 h-8 rounded-full bg-muted border border-border overflow-hidden relative">
                    {listing.publisherAvatar ? (
                      <Image src={listing.publisherAvatar} alt={listing.publisherName ?? ''} fill className="object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">م</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold hover:text-primary transition-colors">
                    {listing.publisherName ?? 'مستخدم'}
                  </span>
                </Link>
                <span className="text-xs text-muted-foreground">
                  {listing.views ? `${listing.views} مشاهدة` : 'جديد'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-base font-bold mb-2">الوصف</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {listing.description ?? 'لا يوجد وصف متاح.'}
              </p>
            </div>

            {/* Attributes grid */}
            <div>
              <h2 className="text-base font-bold mb-3">تفاصيل العقار</h2>
              <div className="grid grid-cols-2 gap-3">
                <AttrBadge label="نوع الإعلان"  value={listing.listingType} />
                <AttrBadge label="نوع العقار"   value={listing.propertyType} />
                <AttrBadge label="المساحة"       value={listing.size ? `${listing.size} م²` : undefined} />
                <AttrBadge label="الغرف"          value={listing.rooms} />
                <AttrBadge label="الحمامات"       value={listing.bathrooms} />
                <AttrBadge label="بلكونة"         value={listing.balcony} />
                <AttrBadge label="المواقف"        value={listing.parking} />
                <AttrBadge label="نظام المواقف"   value={listing.parkingSystems?.join(', ')} />
                <AttrBadge label="التكييف"        value={listing.ac} />
                <AttrBadge label="الكهرباء"       value={listing.electricity} />
                <AttrBadge label="الماء"          value={listing.water} />
              </div>
            </div>
          </div>
        </div>

        {/* Gated contact bar */}
        <ContactBar listingId={listing.id} publisherId={listing.publisherId} isOwner={isOwner} />
      </div>
    </HydrationBoundary>
  );
}
