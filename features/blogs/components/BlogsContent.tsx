"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_BLOGS } from '@/features/blogs/data/mock';
import { BlogCard } from '@/features/blogs/components/BlogCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function BlogsContent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const PER_PAGE = 6;
  
  const totalPages = Math.ceil(MOCK_BLOGS.length / PER_PAGE);
  const startIndex = (currentPage - 1) * PER_PAGE;
  const currentBlogs = MOCK_BLOGS.slice(startIndex, startIndex + PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 min-h-[70vh]">
      <div className="flex flex-col gap-2 mb-10 text-center md:text-right">
        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">المدونة العقارية</h1>
        <p className="text-muted-foreground text-lg md:text-xl font-medium">أحدث المقالات، النصائح، واتجاهات السوق السكني والتجاري.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentBlogs.map((b) => (
          <BlogCard key={b.id} blog={b} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            disabled={currentPage <= 1}
            className="w-12 h-12 rounded-full p-0"
            aria-label="الصفحة السابقة"
            asChild={currentPage > 1}
          >
            {currentPage > 1 ? (
              <Link href={`/blogs?page=${currentPage - 1}`}>
                <ChevronRight className="w-5 h-5"/>
              </Link>
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground"/>
            )}
          </Button>

          <span className="text-sm font-bold">
            صفحة {currentPage} من {totalPages}
          </span>

          <Button 
            variant="outline" 
            disabled={currentPage >= totalPages}
            className="w-12 h-12 rounded-full p-0"
            aria-label="الصفحة التالية"
            asChild={currentPage < totalPages}
          >
            {currentPage < totalPages ? (
              <Link href={`/blogs?page=${currentPage + 1}`}>
                <ChevronLeft className="w-5 h-5"/>
              </Link>
            ) : (
              <ChevronLeft className="w-5 h-5 text-muted-foreground"/>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
