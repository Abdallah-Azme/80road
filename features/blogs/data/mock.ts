import { Blog } from "../types";

export const MOCK_BLOGS: Blog[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `blog-${i + 1}`,
  slug: `real-estate-trends-kuwait-${i + 1}`,
  title: `اتجاهات سوق العقار في الكويت لعام ٢٠٢٦ - الجزء ${i + 1}`,
  excerpt: `في هذه المقالة، نستعرض أبرز التوقعات لسوق العقار في الكويت، بما في ذلك أسعار الأراضي والشقق السكنية والتوجهات الاستثمارية الجديدة التي تهم كل مستثمر.`,
  content: `<p>يعتبر سوق العقار في الكويت من الأسواق الواعدة والمستقرة في المنطقة...</p><p>في هذا الجزء نناقش بالتفصيل كيف تؤثر التشريعات الجديدة على معدلات الشراء...</p>`,
  imageUrl: i % 2 === 0 
    ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop',
  author: 'أحمد العقاري',
  publishedAt: new Date(Date.now() - i * 86400000 * 3).toISOString().split('T')[0],
  category: 'استثمار'
}));
