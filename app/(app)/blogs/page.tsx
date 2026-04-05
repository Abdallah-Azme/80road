import React, { Suspense } from 'react';
import { BlogsContent } from '@/features/blogs/components/BlogsContent';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المدونة العقارية | 80road - أحدث أخبار العقارات في الكويت",
  description: "تابع أحدث المقالات والنصائح العقارية، واتجاهات السوق السكني والتجاري في الكويت. دليل شامل للمستثمرين والباحثين عن سكن مع 80road.",
  keywords: ["أخبار العقار الكويت", "نصائح عقارية", "سوق العقار الكويتي", "80road مدونة"],
  openGraph: {
    title: "المدونة العقارية في 80road",
    description: "كل ما تود معرفته عن العقار في الكويت",
    images: ["/og-blog.png"],
  },
};

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading blogs...</div>}>
      <BlogsContent />
    </Suspense>
  );
}
