import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | 80road',
  description: 'Get in touch with the 80road team for inquiries and support.',
};

// ISR (Incremental Static Regeneration)
// Tell Next.js to cache this page and revalidate it every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function ContactPage() {
  /*
   * Here we simulate fetching from a real backend.
   * In a real integration, you would use:
   * 
   * const res = await fetch('YOUR_BACKEND_URL/api/pages/contact', { 
   *   next: { revalidate: 3600 } 
   * });
   * const data = await res.json();
   */
  const data = await new Promise<{ title: string, content: string, email: string, phone: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        title: 'اتصل بنا',
        content: '<p>يسعدنا تواصلكم معنا. يمكنكم الوصول إلينا من خلال البريد الإلكتروني أو الهاتف المذكور أدناه لمزيد من الاستفسارات أو الدعم الفني.</p>',
        email: 'info@80road.com',
        phone: '+965 1234 5678'
      });
    }, 1000);
  });

  return (
    <main className="min-h-screen py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-[40px] p-8 md:p-12 shadow-sm text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
            {data.title}
          </h1>
          <div 
            className="text-lg text-gray-700 dark:text-gray-300 mb-10 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data.content }} 
          />
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href={`mailto:${data.email}`} 
              className="flex items-center gap-3 px-6 py-4 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-colors font-medium w-full md:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              {data.email}
            </a>
            
            <a 
              href={`tel:${data.phone}`} 
              className="flex items-center gap-3 px-6 py-4 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-colors font-medium w-full md:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span dir="ltr">{data.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
