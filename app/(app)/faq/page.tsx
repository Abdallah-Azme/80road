import { staticPageService } from "@/shared/services/page.service";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | 80road",
  description:
    "إجابات على أكثر الأسئلة تكراراً حول استخدام منصة 80road العقارية.",
};

export default async function FaqPage() {
  const response = await staticPageService.getFaqs().catch(() => null);
  const faqs = response?.data || [];

  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-500">
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
        dir="rtl"
      >
        {/* Header Section */}
        <SectionHeader
          title="الأسئلة الشائعة"
          description="كل ما تحتاج إلى معرفته حول منصة 80road وكيفية استخدامها."
          className="mb-12 text-center md:text-right"
        />

        {/* FAQ Accordion Section */}
        <div className="bg-card border border-border/60 rounded-[40px] p-6 md:p-12 shadow-2xl shadow-primary/5">
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border border-border/60 rounded-[24px] px-6 overflow-hidden transition-all data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5"
                >
                  <AccordionTrigger className="text-right py-6 hover:no-underline hover:text-primary transition-colors font-bold text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-right text-muted-foreground leading-relaxed text-base font-medium pb-6 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-muted-foreground opacity-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-black">لا توجد أسئلة حالياً</h3>
                <p className="text-muted-foreground">
                  نحن نعمل على جمع وإدراج الأسئلة الشائعة لمساعدتك بشكل أفضل.
                </p>
              </div>
            </div>
          )}

          {/* Contact Support CTA */}
          {/* <div className="mt-16 p-8 rounded-3xl bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center text-center gap-4">
             <p className="text-muted-foreground font-medium">لم تجد إجابة لسؤالك؟</p>
             <button className="text-primary font-black hover:underline underline-offset-4">تواصل مع الدعم الفني</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
