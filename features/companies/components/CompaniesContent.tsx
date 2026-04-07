'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SectionHeader } from '@/components/ui/section-header';
import { CategoryGrid } from './CategoryGrid';
import { OfficeCardSkeleton } from './OfficeCard';
import { OfficesGrid } from './OfficesGrid';

function CompaniesContentInner() {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category');

  if (category) {
    return (
      <>
        <SectionHeader 
          title="قائمة الشركات"
          description={`تصفّح نخبة الشركات العقارية الموثوقة في فئة ${category}.`}
        />
        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <OfficeCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <OfficesGrid />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <SectionHeader 
        title="تصنيفات الشركات"
        description="اختر التصنيف المناسب للبحث عن أفضل المكاتب العقارية المصنفة والشركات الإنشائية."
      />
      <CategoryGrid />
    </>
  );
}

export function CompaniesContent() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center">جاري التحميل...</div>}>
      <CompaniesContentInner />
    </Suspense>
  );
}
