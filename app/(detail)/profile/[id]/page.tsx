import type { Metadata } from "next";
import { CustomImage as Image } from "@/shared/components/custom-image";
import { BadgeCheck } from "lucide-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/types";
import {
  fetchOfficeById,
  fetchOfficeAds,
} from "@/features/companies/services/offices.service";
import { HomeListingCard } from "@/features/home/components/HomeListingCard";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [{ id: "1" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (id === "1") return { title: "80road" };
  
  try {
    const office = await fetchOfficeById(id);
    if (!office) return { title: "ملف غير موجود | 80road" };
    return {
      title: `${office.officeName ?? "شركة عقارية"} | عقارات الكويت | 80road`,
      description: office.bio?.slice(0, 160) ?? `تصفح إعلانات وعروض ${office.officeName ?? "الشركة"} العقارية على 80road.`,
      openGraph: { title: office.officeName ?? "شركة عقارية", description: office.bio ?? "عضو في 80road", images: [office.logo ?? "/og-profile-default.png"] },
    };
  } catch {
    return { title: "ملف غير موجود | 80road" };
  }
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
  if (id === "1") return null;

  const queryClient = getQueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.offices.detail(id),
        queryFn: () => fetchOfficeById(id),
      }),
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.offices.ads(id),
        queryFn: () => fetchOfficeAds(id),
      }),
    ]);
  } catch {
    // allow client to retry and fail gracefully
  }

  const office = queryClient.getQueryData<
    Awaited<ReturnType<typeof fetchOfficeById>>
  >(QUERY_KEYS.offices.detail(id));

  const officeAds =
    queryClient.getQueryData<Awaited<ReturnType<typeof fetchOfficeAds>>>(
      QUERY_KEYS.offices.ads(id),
    ) ?? [];

  const listings = officeAds;

  const name: string = office?.officeName ?? "ناشر الإعلان";
  const bio: string = office?.bio ?? "عضو في 80road";
  const avatar = office?.logo ?? null;
  const verified = office?.verified ?? false;
  const stats = {
    ads: (office?.activeListingsCount ?? listings.length).toString(),
    views: (office?.totalViews ?? 0).toLocaleString(),
    rating: (office?.rating ?? 0).toString(),
  };

  // const contacts = [
  //   {
  //     href: `https://wa.me/${office?.whatsapp ?? ""}`,
  //     Icon: MessageCircle,
  //     id: "profile-wa",
  //     label: "واتساب",
  //   },
  //   {
  //     href: `tel:${office?.phone ?? ""}`,
  //     Icon: Phone,
  //     id: "profile-tel",
  //     label: "اتصال",
  //   },
  //   {
  //     href: "https://instagram.com/",
  //     Icon: InstagramIcon,
  //     id: "profile-instagram",
  //     label: "انستغرام",
  //   },
  //   {
  //     href: "https://tiktok.com/",
  //     Icon: TikTokIcon,
  //     id: "profile-tiktok",
  //     label: "تيك توك",
  //   },
  //   {
  //     href: "https://snapchat.com/",
  //     Icon: SnapchatIcon,
  //     id: "profile-snapchat",
  //     label: "سناب شات",
  //   },
  //   {
  //     href: "https://maps.google.com/",
  //     Icon: MapPin,
  //     id: "profile-maps",
  //     label: "خرائط جوجل",
  //   },
  //   {
  //     href: "https://example.com",
  //     Icon: Globe,
  //     id: "profile-web",
  //     label: "الموقع الإلكتروني",
  //   },
  //   {
  //     href: "https://example.com/link",
  //     Icon: Link2,
  //     id: "profile-link",
  //     label: "رابط إضافي",
  //   },
  // ];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-background animate-in fade-in duration-300">
        {/* Profile Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <h1 className="sr-only">الملف الشخصي لـ {name} على 80road</h1>
          <div
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
            dir="rtl"
          >
            {/* Sidebar (3 columns on desktop) - Profile Info */}
            <div className="lg:col-span-3 order-1">
              <div className="lg:sticky lg:top-28 flex flex-col gap-8">
                {/* User Card with Depth */}
                <div className="bg-card rounded-[40px] p-8 md:p-10 shadow-2xl shadow-primary/5 border border-border/60 flex flex-col items-center text-center gap-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-1000" />

                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card shadow-2xl overflow-hidden bg-muted">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt={name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-black text-primary/30">
                        م
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 relative z-10">
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="text-2xl md:text-xl font-black tracking-tight">
                        {name}
                      </h2>
                      {verified && (
                        <BadgeCheck className="w-7 h-7 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed px-2">
                      {bio}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="bg-card rounded-[32px] shadow-xl shadow-black/5 border border-border/60 p-6 grid grid-cols-3 divide-x divide-x-reverse divide-border/60">
                  <StatItem label="إعلان" value={stats.ads} />
                  <StatItem label="مشاهدة" value={stats.views} />
                  <StatItem label="تقييم" value={stats.rating} />
                </div>

                {/* Contact & Socials */}
                <div className="flex flex-col gap-4">
                  {/* <div className="flex gap-3">
                    <Button
                      id="profile-whatsapp"
                      variant="outline"
                      className="flex-1 h-16 rounded-2xl font-black border-green-500/20 text-green-600 bg-green-500/5 hover:bg-green-500/10 gap-2 text-base"
                    >
                      <MessageCircle className="w-5 h-5" /> واتساب
                    </Button>
                    <Button
                      id="profile-call"
                      className="flex-1 h-16 rounded-2xl font-black shadow-lg shadow-primary/20 gap-2 text-base"
                    >
                      <Phone className="w-5 h-5" /> اتصال
                    </Button>
                  </div> */}

                  {/* <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {contacts.map(({ href, Icon, id: btnId, label }) => (
                      <a
                        key={btnId}
                        id={btnId}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border/60 text-foreground/80 shadow-sm hover:border-primary/40 hover:bg-linear-to-br hover:from-primary/5 hover:to-primary/10 hover:text-primary active:scale-90 transition-all"
                      >
                        <Icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div> */}
                </div>
              </div>
            </div>

            {/* Main Area (9 columns on desktop) - Lists */}
            <div className="lg:col-span-9 order-2">
              <section className="flex flex-col gap-8 md:gap-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-8">
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-4xl font-black tracking-tight">
                      إعلانات نشطة
                    </h3>
                    <p className="text-muted-foreground font-medium text-base md:text-lg">
                      إليك {stats.ads} عقار متاح حالياً للمعاينة
                    </p>
                  </div>
                </div>

                {listings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-muted/20 rounded-[40px] border-2 border-dashed border-border/60 text-muted-foreground/40">
                    <p className="font-bold text-xl">لا توجد إعلانات نشطة</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {listings.map((listing, i) => (
                      <HomeListingCard
                        key={`${listing.id}-${i}`}
                        listing={listing}
                      />
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
