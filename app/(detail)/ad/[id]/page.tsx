import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchListingById } from '@/features/listing-detail/services/listing-detail.service';
import { SectionHeader } from '@/components/ui/section-header';
import { MediaCarousel } from '@/features/listing-detail/components/MediaCarousel';
import { ContactBar } from '@/features/listing-detail/components/ContactBar';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { CustomImage as Image } from '@/shared/components/custom-image';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await fetchListingById(Number(id));
  
  if (!listing) {
    return { title: 'إعلان غير موجود | 80road' };
  }

  const images = listing.images.length > 0 ? listing.images : ['/og-ad-default.png'];

  return {
    title: `${listing.title} | ${listing.area} | 80road`,
    description: listing.description?.slice(0, 160) ?? 'تصفح تفاصيل هذا الإعلان المميز على 80road.',
    keywords: [listing.propertyType, listing.listingType, listing.area, listing.governorate, "عقارات الكويت", "80road"].filter(Boolean) as string[],
    openGraph: {
      title: listing.title,
      description: listing.description?.slice(0, 160),
      images: images,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description: listing.description?.slice(0, 160),
      images: images,
    },
  };
}

export async function generateStaticParams() {
  if (process.env.MOBILE_BUILD === 'true') {
    // For capacitor export, supply the demo ids
    return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
  }
  return [];
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" dir="rtl">
            
            {/* Right Column: Media + Main Info (8 columns on desktop) */}
            <div className="lg:col-span-8 flex flex-col gap-8 order-1">
              <div className="rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-black/10">
                <MediaCarousel listing={listing} />
              </div>

              <div className="flex flex-col gap-8" dir="rtl">
                {/* Title and Price */}
                <div className="bg-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl shadow-primary/5 border border-border/60">
                  <div className="flex flex-col md:flex-row md:items-center justify-between items-start gap-4 mb-6">
                    <h1 className="text-2xl md:text-4xl font-black leading-tight tracking-tight">{listing.title}</h1>
                    <span className="text-primary font-black text-3xl md:text-4xl">{listing.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base mb-8">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{listing.area}، {listing.governorate}</span>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-border/60">
                    <Link
                      href={listing.publisherId ? `/profile/${listing.publisherId}` : '#'}
                      className="flex items-center gap-4 active:scale-95 transition-transform group"
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted border-2 border-border overflow-hidden relative">
                        {listing.publisherAvatar ? (
                          <Image src={listing.publisherAvatar} alt={listing.publisherName ?? ''} fill className="object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-muted-foreground text-xl font-bold">م</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base md:text-lg font-black group-hover:text-primary transition-colors">
                          {listing.publisherName ?? 'مستخدم'}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">معلن موثوق • استجابة سريعة</span>
                      </div>
                    </Link>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-foreground">
                        {listing.views ? `${listing.views} مشاهدة` : 'جديد'}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">منذ يومين</span>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl shadow-black/5 border border-border/60">
                  <SectionHeader 
                    title="وصف العقار"
                    description="تفاصيل كاملة حول المواصفات والميزات الفريدة لهذا العقار."
                    className="mb-6"
                  />
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line font-medium">
                    {listing.description ?? 'لا يوجد وصف متاح.'}
                  </p>
                </div>

                {/* Attributes Section */}
                <div className="bg-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 shadow-xl shadow-black/5 border border-border/60">
                   <SectionHeader 
                     title="تفاصيل العقار"
                     description="المعلومات التقنية والمرافق المتوفرة في الوحدة العقارية."
                     className="mb-8"
                   />
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
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

            {/* Left Column: Sticky Contact Info (4 columns on desktop) */}
            <div className="lg:col-span-4 order-2">
              <div className="lg:sticky lg:top-28 flex flex-col gap-8">
                <ContactBar listingId={listing.id} publisherId={listing.publisherId} isOwner={isOwner} />
                
                {/* Additional Sidebar Info (Desktop Only) */}
                <div className="hidden lg:flex flex-col gap-6 bg-muted/30 rounded-[32px] p-8 border border-border/60">
                  <h3 className="font-black text-base text-foreground">نصائح الأمان</h3>
                  <ul className="text-sm text-muted-foreground flex flex-col gap-4 font-medium">
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>لا ترسل مبالغ مالية مسبقاً قبل معاينة العقار.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>عاين العقار على الطبيعة وتأكد من كافة التفاصيل.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>اطلب المستندات الرسمية التي تثبت ملكية العقار.</span>
                    </li>
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
