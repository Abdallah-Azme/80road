'use client';

import { useOffices } from '../hooks/useOffices';
import { OfficeCard, OfficeCardSkeleton } from './OfficeCard';

export function OfficesGrid() {
  const { data, isPending, isError } = useOffices();

  if (isError) {
    return (
      <p className="text-center text-destructive text-sm py-10" dir="rtl">
        تعذّر تحميل الشركات. يرجى المحاولة لاحقاً.
      </p>
    );
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <OfficeCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 pb-28" dir="rtl">
      {data.map(office => (
        <OfficeCard key={office.id} office={office} />
      ))}
    </div>
  );
}
