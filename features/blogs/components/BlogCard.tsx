import Link from 'next/link';
import { CustomImage as Image } from '@/shared/components/custom-image';
import { Blog } from '../types';
import { Card, CardContent } from '@/components/ui/card';

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 rounded-2xl p-0">
      <Link href={`/blogs/${blog.id}`} className="block">
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={blog.image || '/images/placeholder-blog.jpg'}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
            {blog.category_name}
          </div>
        </div>
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>{blog.created_at}</span>
            <span>•</span>
            <span>{blog.publisher_name}</span>
          </div>
          <h3 className="text-lg text-foreground line-clamp-2 md:leading-tight group-hover:text-primary transition-colors font-bold">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {blog.description}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}

