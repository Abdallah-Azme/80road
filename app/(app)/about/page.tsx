import { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "من نحن | 80road - المنصة العقارية الرائدة في الكويت",
  description:
    "تعرف على 80road، وجهتك الموثوقة لكل ما يخص العقارات في الكويت. نحن نسعى لتوفير تجربة بحث فريدة وسلسة للباحثين عن شقق، فلل، وأراضي.",
  keywords: ["عن 80road", "من نحن", "عقارات الكويت", "منصة عقارية", "80road"],
  openGraph: {
    title: "من نحن - 80road",
    description: "تعرف على منصة 80road العقارية ورؤيتنا",
    images: ["/og-about.png"],
  },
};

export const revalidate = 3600;

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" dir="rtl">
        <SectionHeader
          title="من نحن"
          description="تعرف على منصة 80road ورؤيتنا في تطوير سوق العقارات."
          className="mb-12 text-center md:text-right"
        />

        <div className="bg-card border border-border/60 rounded-[40px] p-8 md:p-14 shadow-2xl shadow-primary/5 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-foreground">🏢 من نحن</h2>
            <p className="text-lg text-foreground/80 leading-relaxed font-medium">
              منصة <strong>80road</strong> هي المنصة الرائدة والأولى في مجال العقارات في الكويت،
              حيث نسعى دائمًا لتقديم أفضل الحلول والخدمات العقارية لعملائنا بكل سهولة ويسر.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-foreground">🎯 رؤيتنا</h2>
            <p className="text-lg text-foreground/80 leading-relaxed font-medium">
              أن نكون الخيار الأول والوجهة الموثوقة لكل ما يخص العقارات في المنطقة،
              وتسهيل رحلة العميل من البحث إلى التعاقد بشكل احترافي وشفاف.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-foreground">🤝 مهمتنا</h2>
            <p className="text-lg text-foreground/80 leading-relaxed font-medium">
              نهدف إلى ربط البائعين والمشترين، والمؤجرين والمستأجرين في بيئة آمنة وفعالة،
              معتمدين على أحدث التقنيات وأفضل معايير الجودة لتسهيل عملية البحث عن العقار المناسب.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/60">
            {[
              { label: "إعلانات نشطة", value: "١٠٠٠+", icon: "📋" },
              { label: "عملاء راضون", value: "٥٠٠٠+", icon: "⭐" },
              { label: "مناطق مشمولة", value: "٦ محافظات", icon: "📍" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-3xl bg-muted/30 border border-border/40 text-center"
              >
                <span className="text-4xl">{stat.icon}</span>
                <span className="text-3xl font-black text-primary">{stat.value}</span>
                <span className="text-sm font-bold text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
