import { CategoryGrid } from "@/features/companies/components/CategoryGrid";
import { OfficeCardSkeleton } from "@/features/companies/components/OfficeCard";
import { OfficesGrid } from "@/features/companies/components/OfficesGrid";
import { fetchOffices } from "@/features/companies/services/offices.service";
import { getQueryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/types";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "الشركات العقارية | 80road",
  description: "تصفّح أفضل المكاتب العقارية والشركات الانشائية في الكويت",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function CompaniesPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.offices.all,
    queryFn: fetchOffices,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 animate-in fade-in duration-500"
        dir="rtl"
      >
        {category ? (
          <>
            <SectionHeader 
              title="قائمة الشركات"
              description={`تصفّح نخبة الشركات العقارية الموثوقة في فئة ${category}.`}
            />
            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <OfficeCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <OfficesGrid />
            </Suspense>
          </>
        ) : (
          <>
            <SectionHeader 
              title="تصنيفات الشركات"
              description="اختر التصنيف المناسب للبحث عن أفضل المكاتب العقارية المصنفة والشركات الإنشائية."
            />
            <CategoryGrid />
          </>
        )}
      </div>
    </HydrationBoundary>
  );
}
