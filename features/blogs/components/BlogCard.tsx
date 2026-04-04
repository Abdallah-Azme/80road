import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '../types';
import { Card, CardContent } from '@/components/ui/card';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 rounded-2xl">
      <Link href={`/blogs/${blog.slug}`}>
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
            {blog.category}
          </div>
        </div>
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <span>{blog.publishedAt}</span>
            <span>•</span>
            <span>{blog.author}</span>
          </div>
          <h3 className="font-extrabold text-lg text-foreground line-clamp-2 md:leading-tight group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {blog.excerpt}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
