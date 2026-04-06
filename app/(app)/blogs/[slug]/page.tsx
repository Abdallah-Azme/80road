import { notFound } from 'next/navigation';
import { MOCK_BLOGS } from '@/features/blogs/data/mock';
import { CustomImage as Image } from '@/shared/components/custom-image';
import Link from 'next/link';
import { ChevronRight, Calendar, User, Tag } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = MOCK_BLOGS.find((b) => b.slug === resolvedParams.slug);
  
  if (!blog) {
    return { title: 'مقال غير موجود' };
  }

  return {
    title: `${blog.title} | 80road`,
    description: blog.excerpt,
  };
}

export async function generateStaticParams() {
  return MOCK_BLOGS.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function SingleBlogPage({ params }: Props) {
  const resolvedParams = await params;
  const blog = MOCK_BLOGS.find((b) => b.slug === resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Breadcrumb / Back Navigation */}
      <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-8">
        <ChevronRight className="w-4 h-4" />
        العودة إلى المدونة
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary" />{blog.category}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{blog.publishedAt}</span>
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{blog.author}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-foreground leading-[1.3] md:leading-tight">
          {blog.title}
        </h1>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl border border-border/50">
        <Image
          src={blog.imageUrl}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Article Content */}
      <article 
        className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 font-medium md:leading-loose"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
