"use client";

import Link from "next/link";
import { useDepartments } from "../hooks/useDepartments";
import { CustomImage as Image } from "@/shared/components/custom-image";
import { Loader2 } from "lucide-react";

export function CategoryGrid() {
  const { data, isPending, isError } = useDepartments();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
        <p className="text-destructive font-black">تعذر تحميل التصنيفات</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 pb-10"
        dir="rtl"
      >
        {data?.map(({ id, name, icon }) => (
          <Link
            key={id}
            href={`/companies?category=${id}`}
            id={`category-${id}`}
            className="group flex flex-col items-center gap-6 p-8 rounded-[40px] bg-card border border-border/60 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 hover:border-primary/40 transition-all duration-500"
          >
            <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-muted/50 to-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner overflow-hidden relative">
              {icon ? (
                <Image src={icon} alt={name} fill className="object-cover p-4" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/30 text-3xl font-black">
                  C
                </div>
              )}
            </div>
            <span className="text-xl font-black text-center leading-tight tracking-tight">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
