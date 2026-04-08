import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/types";
import { fetchExploreFeed } from "@/features/explore/services/explore.service";
import { ExploreFeed } from "@/features/explore/components/ExploreFeed";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ExploreFilters } from "@/features/explore/components/ExploreFilters";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "اكسبلور العقارات | 80road - فيديوهات عقارية قصيرة في الكويت",
  description:
    "استعرض أحدث إعلانات العقارات في الكويت بأسلوب الفيديو القصير. شاهد الشقق والفلل من الداخل عبر تجربة بصرية فريدة مع 80road.",
  keywords: [
    "عقارات الكويت فيديو",
    "اكسبلور عقارات",
    "فيديوهات شقق",
    "فلل الكويت",
    "80road",
  ],
  openGraph: {
    title: "اكسبلور 80road - تجربة عقارية بصرية جديدة",
    description: "استعرض إعلانات العقارات بأسلوب الفيديو القصير في الكويت",
    images: ["/og-explore.png"],
  },
};

export default async function ExplorePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.listings.explore,
    queryFn: () => fetchExploreFeed(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24" dir="rtl">
        {/* SEO Main Heading (Visually Hidden) */}
        <h1 className="sr-only">
          اكسبلور 80road - منصة عرض العقارات بالفيديو في الكويت
        </h1>
        {/* ── Mobile Filters Trigger ── */}
        <div className="md:hidden flex items-center justify-between mb-8 pt-6">
          <h2 className="text-xl font-black tracking-tight">اكسبلور</h2>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2.5 px-5 py-3 border border-border/60 rounded-2xl font-black bg-card shadow-xl shadow-black/5 hover:bg-muted transition-all active:scale-95 text-sm">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                تصفية
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[85vh] rounded-t-[40px] px-6 pt-10"
              dir="rtl"
            >
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-black text-right">
                  تصفية النتائج
                </SheetTitle>
                <SheetDescription className="sr-only">
                  استخدم الخيارات أدناه لتصفية نتائج البحث عن العقارات
                </SheetDescription>
              </SheetHeader>
              <div className="overflow-y-auto no-scrollbar pb-10">
                <ExploreFilters />
                <button className="w-full mt-10 py-5 bg-primary text-primary-foreground rounded-3xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all">
                  عرض النتائج
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div
          className="flex flex-col md:flex-row gap-4 md:gap-12 w-full md:pt-12"
          dir="rtl"
        >
          {/* ── Main Catalog Feed ── */}
          <div className="flex-1 min-w-0">
            <SectionHeader
              title="اكسبلور"
              description="استعرض أحدث العقارات بأسلوب الفيديوهات القصيرة والبحث السريع."
              className="mb-8"
            />
            <Suspense
              fallback={
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 animate-pulse">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted rounded-xl"
                    />
                  ))}
                </div>
              }
            >
              <ExploreFeed />
            </Suspense>
          </div>

          {/* ── Desktop Filter Sidebar ── */}
          <aside className="hidden md:block w-72 lg:w-80 shrink-0">
            <div className="sticky top-[96px] flex flex-col gap-8">
              <div className="bg-card border border-border/60 rounded-[40px] p-8 shadow-2xl shadow-primary/5">
                <h3 className="font-black text-xl mb-6">تصفية النتائج</h3>
                <ExploreFilters />
                <button className="w-full mt-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  تطبيق الفلاتر
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </HydrationBoundary>
  );
}
