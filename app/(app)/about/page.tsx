import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | 80road',
  description: 'Learn more about 80road, your premier real estate platform.',
};

// ISR (Incremental Static Regeneration)
// Tell Next.js to cache this page and revalidate it every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function AboutPage() {
  /*
   * Here we simulate fetching from a real backend.
   * In a real integration, you would use:
   * 
   * const res = await fetch('YOUR_BACKEND_URL/api/pages/about', { 
   *   next: { revalidate: 3600 } 
   * });
   * const data = await res.json();
   */
  const data = await new Promise<{ title: string, content: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        title: 'من نحن - 80road',
        content: `
          <div class="space-y-6">
            <p class="text-lg leading-relaxed">
              منصة <strong>80road</strong> هي المنصة الرائدة والأولى في مجال العقارات، حيث نسعى دائمًا لتقديم أفضل الحلول والخدمات العقارية لعملائنا بكل سهولة ويسر.
            </p>
            <p class="text-lg leading-relaxed">
              نهدف إلى ربط البائعين والمشترين، والمؤجرين والمستأجرين في بيئة آمنة وفعالة، معتمدين على أحدث التقنيات وأفضل معايير الجودة لتسهيل عملية البحث عن العقار المناسب بكل ثقة وأمان.
            </p>
            <h2 class="text-2xl font-semibold mt-8 mb-4">رؤيتنا</h2>
            <p class="text-lg leading-relaxed">
              أن نكون الخيار الأول والوجهة الموثوقة لكل ما يخص العقارات في المنطقة، وتسهيل رحلة العميل من البحث إلى التعاقد.
            </p>
          </div>
        `
      });
    }, 1000);
  });

  return (
    <main className="min-h-screen py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-sm">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            {data.title}
          </h1>
          <div 
            className="text-gray-700 dark:text-gray-300 [&>div>h2]:text-gray-900 [&>div>h2]:dark:text-white"
            dangerouslySetInnerHTML={{ __html: data.content }} 
          />
        </div>
      </div>
    </main>
  );
}
