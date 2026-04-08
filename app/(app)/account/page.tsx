"use client";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { UpdateProfileDialog } from "@/features/account/components/UpdateProfileDialog";
import {
  useProfile,
  useUserAds,
  useUserFavorites,
} from "@/features/account/hooks/useProfile";
import { HomeListingCard } from "@/features/home/components/HomeListingCard";
import { cn } from "@/lib/utils";
import { CustomImage as Image } from "@/shared/components/custom-image";
import { LogoutDialog } from "@/features/auth/components/LogoutDialog";
import { useUserStore } from "@/stores/user.store";
import {
  BadgeCheck,
  Edit2,
  LayoutGrid as Grid,
  Pencil,
  Settings,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function StatCard({
  label,
  value,
  trend,
  color,
}: {
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-[32px] p-6 shadow-xl shadow-black/5 flex flex-col gap-2 group transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
        <div className={cn("w-2 h-2 rounded-full animate-pulse", color)} />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tight">{value}</span>
        <span className="text-[10px] font-bold text-emerald-500 mt-1">
          {trend}
        </span>
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { data: myAds = [], isLoading: isAdsLoading } = useUserAds();
  const { data: favListings = [], isLoading: isFavLoading } =
    useUserFavorites();
  const [activeTab, setActiveTab] = useState<"إعلاناتي" | "مفضلتي">("إعلاناتي");

  useEffect(() => {
    if (!user) router.replace("/auth");
  }, [user, router]);

  if (!user) return null;

  const displayList = activeTab === "إعلاناتي" ? myAds : favListings;
  const isTabLoading = activeTab === "إعلاناتي" ? isAdsLoading : isFavLoading;

  return (
    <div className="min-h-screen bg-background pb-20 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-10">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start"
          dir="rtl"
        >
          <h1 className="sr-only">لوحة تحكم المستخدم - 80road</h1>

          <aside className="md:col-span-4 lg:col-span-3 md:sticky md:top-24 space-y-6">
            <div className="bg-card border border-border/60 rounded-[40px] p-8 shadow-2xl shadow-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

              <div className="relative z-10 flex flex-col items-center gap-5">
                <div className="relative inline-block group/avatar-container">
                  <div className="relative w-32 h-32 rounded-full bg-linear-to-tr from-muted to-primary/10 border-4 border-card shadow-2xl overflow-hidden group/avatar">
                    {profile?.image || user.avatar ? (
                      <Image
                        src={profile?.image || user.avatar || ""}
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/40">
                        م
                      </div>
                    )}
                    <UpdateProfileDialog profileData={profile}>
                      <button
                        aria-label="تغيير الصورة الشخصية"
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Edit2 className="w-6 h-6 text-white" />
                      </button>
                    </UpdateProfileDialog>
                  </div>
                  <UpdateProfileDialog profileData={profile || undefined}>
                    <button
                      aria-label="تحديث الملف الشخصي"
                      className="absolute top-0 left-0 bg-background shadow-md border border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full p-2 z-20 cursor-pointer transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </UpdateProfileDialog>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1 group">
                    <h2 className="text-2xl font-black tracking-tight">
                      {profile?.name || user.name || "مستخدم جديد"}
                    </h2>
                    <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {profile?.caption || "وسيط عقاري معتمد • خبرة في السوق"}
                  </p>
                  <span
                    className="text-xs font-bold text-primary/80 tracking-widest"
                    dir="ltr"
                  >
                    +965 {user.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-[40px] p-6 shadow-2xl shadow-black/5 flex flex-col gap-3">
              <LogoutDialog />
            </div>
          </aside>

          <main className="md:col-span-8 lg:col-span-9 flex flex-col gap-10">
            <SectionHeader
              title="لوحة التحكم"
              description="تابع أداء إعلاناتك، مشاهداتك، والتحكم في قائمتك المفضلة من مكان واحد."
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              <StatCard
                label="المشاهدات"
                value={(profile?.total_ads_watch ?? 0).toLocaleString()}
                trend="إجمالي"
                color="bg-blue-500"
              />
              <StatCard
                label="اللايكات"
                value={(profile?.total_ads_likes ?? 0).toLocaleString()}
                trend="إجمالي"
                color="bg-pink-500"
              />
              <StatCard
                label="الإعلانات"
                value={(profile?.total_active_ads ?? myAds.length).toString()}
                trend="نشط"
                color="bg-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-10 translate-y-[2px]">
                  {["إعلاناتي", "مفضلتي"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as "إعلاناتي" | "مفضلتي")}
                      className={cn(
                        "text-lg md:text-xl font-black pb-4 transition-all relative",
                        activeTab === tab
                          ? "text-primary border-b-4 border-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  aria-label="الإعدادات"
                  className="p-3 hover:bg-muted rounded-2xl transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {isTabLoading ? (
                <div className="min-h-[450px] flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin opacity-40" />
                </div>
              ) : displayList.length === 0 ? (
                <div className="min-h-[450px] flex flex-col items-center justify-center bg-muted/20 border-2 border-dashed border-border/60 rounded-[50px] p-12 text-center group transition-all hover:bg-muted/30">
                  <div className="w-24 h-24 rounded-full bg-muted/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-700 shadow-inner">
                    <Grid className="w-12 h-12 text-muted-foreground/40 group-hover:text-primary/40" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-3">
                    {activeTab === "إعلاناتي"
                      ? "لا توجد إعلانات حالياً"
                      : "قائمة المفضلة فارغة"}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base max-w-[320px] leading-relaxed mb-10">
                    {activeTab === "إعلاناتي"
                      ? "ابدأ الآن وأضف إعلانك الأول لتصل إلى آلاف المهتمين في الكويت بضغطة زر واحدة."
                      : "تصفح احدث الإعلانات وقم بإضافة ما يعجبك هنا للرجوع إليه لاحقاً."}
                  </p>
                  {activeTab === "إعلاناتي" && (
                    <Button
                      size="lg"
                      className="rounded-2xl h-15 px-10 font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                      onClick={() => router.push("/post-ad")}
                    >
                      إضافة إعلان جديد
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {displayList.map((listing) => (
                    <HomeListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
