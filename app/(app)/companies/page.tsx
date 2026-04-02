import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchOffices } from '@/features/companies/services/offices.service';
import { CategoryGrid } from '@/features/companies/components/CategoryGrid';
import { OfficesGrid } from '@/features/companies/components/OfficesGrid';
import { Suspense } from 'react';
import { OfficeCardSkeleton } from '@/features/companies/components/OfficeCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الشركات العقارية | 80road',
  description: 'تصفّح أفضل المكاتب العقارية والشركات الانشائية في الكويت',
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
      <div className="p-4 pt-3 animate-in fade-in duration-300" dir="rtl">
        {category ? (
          <>
            <h1 className="text-lg font-bold mb-4 sr-only">قائمة الشركات</h1>
            <Suspense
              fallback={
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <OfficeCardSkeleton key={i} />)}
                </div>
              }
            >
              <OfficesGrid />
            </Suspense>
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold mb-1 sr-only">تصنيفات الشركات</h1>
            <CategoryGrid />
          </>
        )}
      </div>
    </HydrationBoundary>
  );
}
