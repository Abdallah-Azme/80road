import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchListingById } from '@/features/listing-detail/services/listing-detail.service';
import { MediaCarousel } from '@/features/listing-detail/components/MediaCarousel';
import { ContactBar } from '@/features/listing-detail/components/ContactBar';
import { MapPin } from 'lucide-react';
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
      <div className="min-h-screen bg-background animate-in fade-in duration-300">
        

        {/* Desktop Header - Reuse if needed or just use standard navigation */}
        {/* Ad Detail Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-10 pb-32 md:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Left Column: Media + Main Info (66% on desktop) */}
            <div className="md:col-span-8 flex flex-col gap-6">
              <div className="md:rounded-3xl overflow-hidden md:shadow-lg">
                <MediaCarousel listing={listing} />
              </div>

              <div className="flex flex-col gap-8 px-5 md:px-0" dir="rtl">
                {/* Title and Price */}
                <div className="bg-card md:rounded-3xl md:p-8 p-5 rounded-3xl shadow-lg shadow-primary/5 border border-border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between items-start gap-4 mb-4">
                    <h1 className="text-xl md:text-3xl font-extrabold leading-snug">{listing.title}</h1>
                    <span className="text-primary font-black text-2xl md:text-3xl">{listing.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base mb-6">
                    <MapPin className="w-5 h-5" />
                    <span>{listing.area}، {listing.governorate}</span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <Link
                      href={listing.publisherId ? `/profile/${listing.publisherId}` : '#'}
                      className="flex items-center gap-3 active:scale-95 transition-transform"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted border border-border overflow-hidden relative">
                        {listing.publisherAvatar ? (
                          <Image src={listing.publisherAvatar} alt={listing.publisherName ?? ''} fill className="object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">م</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold hover:text-primary transition-colors">
                          {listing.publisherName ?? 'مستخدم'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">معلن موثوق</span>
                      </div>
                    </Link>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">
                        {listing.views ? `${listing.views} مشاهدة` : 'جديد'}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">منذ يومين</span>
                    </div>
                  </div>
                </div>

                {/* DescriptionSection */}
                <div className="bg-card md:rounded-3xl md:p-8 p-1">
                  <h2 className="text-lg md:text-xl font-bold mb-4">الوصف</h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {listing.description ?? 'لا يوجد وصف متاح.'}
                  </p>
                </div>

                {/* AttributesSection */}
                <div className="bg-card md:rounded-3xl md:p-8 p-1">
                   <h2 className="text-lg md:text-xl font-bold mb-5">تفاصيل العقار</h2>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

            {/* Right Column: Sticky Contact Info (33% on desktop) */}
            <div className="md:col-span-4">
              <div className="md:sticky md:top-24 flex flex-col gap-6">
                <ContactBar listingId={listing.id} publisherId={listing.publisherId} isOwner={isOwner} />
                
                {/* Additional Sidebar Info (Desktop Only) */}
                <div className="hidden md:flex flex-col gap-4 bg-muted/40 rounded-3xl p-6 border border-border">
                  <h3 className="font-bold text-sm">نصائح الأمان</h3>
                  <ul className="text-xs text-muted-foreground flex flex-col gap-2">
                    <li className="flex gap-2"><span>•</span> لا ترسل أموالاً مسبقاً</li>
                    <li className="flex gap-2"><span>•</span> عاين العقار على الطبيعة</li>
                    <li className="flex gap-2"><span>•</span> اطلب المستندات الرسمية</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
