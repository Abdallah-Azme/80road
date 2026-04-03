import { fetchOffices } from "@/features/companies/services/offices.service";
import { getQueryClient } from "@/lib/query-client";
import { QUERY_KEYS } from "@/lib/types";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { CompaniesContent } from "@/features/companies/components/CompaniesContent";

export const metadata: Metadata = {
  title: "الشركات العقارية | 80road",
  description: "تصفّح أفضل المكاتب العقارية والشركات الانشائية في الكويت",
};

export default async function CompaniesPage() {
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
        <CompaniesContent />
      </div>
    </HydrationBoundary>
  );
}

