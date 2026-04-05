import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { BlogCard } from './BlogCard';
import { MOCK_BLOGS } from '../data/mock';
import Link from 'next/link';

export function HomeBlogsSection() {
  const recentBlogs = MOCK_BLOGS.slice(0, 3);

  return (
    <section className="flex flex-col gap-6 md:gap-8">
      <SectionHeader 
        title="المدونة والأخبار"
        description="ابق على اطلاع بأحدث أخبار ونصائح السوق العقاري في الكويت."
        action={
          <Button variant="ghost" asChild className="text-primary font-black hover:bg-primary/5 hidden md:flex text-base">
            <Link href="/blogs">عرض كل المقالات</Link>
          </Button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
      <div className="md:hidden flex justify-center mt-2">
        <Button variant="outline" asChild className="w-full rounded-2xl h-12 font-bold">
          <Link href="/blogs">تصفح جميع المقالات</Link>
        </Button>
      </div>
    </section>
  );
}
