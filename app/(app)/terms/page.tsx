import { staticPageService } from '@/shared/services/page.service';
import { SectionHeader } from '@/components/ui/section-header';
import { CustomImage as Image } from '@/shared/components/custom-image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | 80road',
  description: 'القواعد واللوائح التنظيمية لاستخدام منصة 80road العقارية في الكويت.',
};

export default async function TermsPage() {
  const response = await staticPageService.getTerms().catch(() => null);
  const data = response?.data;

  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" dir="rtl">
        
        {/* Header Section */}
        <SectionHeader 
          title={data?.title || 'الشروط والأحكام'}
          description="يرجى قراءة الشروط والأحكام بعناية قبل استخدام خدماتنا."
          className="mb-12 text-center md:text-right"
        />

        {/* Content Body */}
        <div className="bg-card border border-border/60 rounded-[40px] p-8 md:p-14 shadow-2xl shadow-primary/5">
          {data?.image && (
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 border border-border">
              <Image src={data.image} alt="الشروط والأحكام" fill className="object-cover" />
            </div>
          )}

          {data?.description ? (
            <div 
              className="prose prose-lg dark:prose-invert max-w-none font-medium leading-[1.8] text-foreground/90 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
               <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <svg className="w-10 h-10 text-muted-foreground opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
               </div>
               <div className="flex flex-col gap-2">
                 <h3 className="text-xl font-black">المحتوى غير متوفر حالياً</h3>
                 <p className="text-muted-foreground">سيتم تحديث هذه الصفحة قريباً بمعلومات الشروط والأحكام.</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
