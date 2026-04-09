"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomImage as Image } from "@/shared/components/custom-image";
import { useWizardStore } from "@/stores/wizard.store";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { usePostAdForm } from "@/features/post-ad/hooks/usePostAdForm";
import { type PostAdValues } from "@/features/post-ad/schemas/post-ad.schema";
import { useCategories } from "@/features/post-ad/hooks/useCategories";
import { useCountries, useStates, useCities } from "@/shared/hooks/useLocation";
import { useSettings } from "@/shared/hooks/useSettings";
import {
  ImageUploadGrid,
  VideoUploadPreview,
} from "@/features/post-ad/components/MediaPreview";
import {
  Category,
  CategoryValue,
} from "@/features/post-ad/services/post-ad.service";
import { useChunkedVideoUpload } from "@/features/post-ad/hooks/useChunkedVideoUpload";
import { toast } from "sonner";

const KNET_LOGO =
  "https://media.licdn.com/dms/image/v2/D4D0BAQFazp_I3lLeQg/company-logo_200_200/company-logo_200_200/0/1715599858189/the_shared_electronic_banking_services_co_knet_logo?e=2147483647&v=beta&t=FfjCLbNIUGrTCTi-tI5nXSNP9B4AcOJbWsFqV0bSWcM";

// ── Shared helpers ──────────────────────────────────────────────────────────
function ProgressTop({
  step,
  totalSteps,
  setStep,
}: {
  step: number;
  totalSteps: number;
  setStep: (s: number) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col gap-6 py-6 md:py-10" dir="rtl">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 min-w-fit">
            <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
              الخطوة {step} من {totalSteps}
            </span>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              إضافة إعلان جديد في 80road
            </h1>
          </div>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden shadow-inner relative">
            <div
              className="absolute inset-y-0 right-0 bg-linear-to-l from-primary to-primary/60 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <div className="w-12 h-12 rounded-2xl border border-border/60 flex items-center justify-center text-xs font-black bg-card shadow-xl shadow-primary/5 shrink-0 translate-y-1">
            {Math.round((step / totalSteps) * 100)}%
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setStep(n)}
              aria-label={`الذهاب للخطوة ${n}`}
              className={cn(
                "min-w-[40px] h-10 rounded-xl border-2 font-black text-sm flex items-center justify-center transition-all active:scale-90 shrink-0",
                step === n
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-110"
                  : n < step
                    ? "bg-primary/5 text-primary border-primary/20"
                    : "bg-card text-muted-foreground border-border/60 hover:border-primary/40",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Title({ label }: { label: string }) {
  return (
    <h2 className="text-2xl md:text-2xl font-black text-center mb-10 md:mb-16 tracking-tighter text-foreground leading-tight">
      {label}
    </h2>
  );
}

function Opt({
  label,
  selected,
  onClick,
  sub,
}: {
  label: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-6 md:p-8 rounded-[40px] border-2 flex items-center justify-between transition-all duration-500 group active:scale-[0.97] text-right",
        selected
          ? "border-primary bg-primary/4 text-primary shadow-2xl shadow-primary/10"
          : "border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-muted/30 hover:shadow-xl hover:-translate-y-1",
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="font-black text-lg md:text-lg tracking-tight leading-none">
          {label}
        </div>
        {sub && (
          <div className="text-sm text-muted-foreground font-bold">{sub}</div>
        )}
      </div>
      <div
        className={cn(
          "w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-500",
          selected
            ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg"
            : "border-muted/60 group-hover:border-primary/40",
        )}
      >
        {selected && <Check className="w-5 h-5 stroke-[4px]" />}
      </div>
    </button>
  );
}


type WizardStep =
  | { type: "category"; data: Category; key: string }
  | { type: "country"; key: string }
  | { type: "state"; key: string }
  | { type: "city"; key: string }
  | { type: "video"; key: string; data?: never }
  | { type: "images"; key: string; data?: never }
  | { type: "summary"; key: string; data?: never };

// ── Main Component ──────────────────────────────────────────────────────────
function PostAdWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: countries } = useCountries();
  const { data: settings } = useSettings();

  const {
    postAdForm: storeData,
    setPostAdValue,
    resetPostAdForm,
  } = useWizardStore();
  const { form, onSubmit } = usePostAdForm(storeData);

  // Chunked video upload state
  const { uploadState, uploadVideo, reset: resetVideoUpload } = useChunkedVideoUpload();

  const countryId = form.watch("country");
  const stateId = form.watch("governorate");

  const { data: states } = useStates(countryId);
  const { data: cities } = useCities(stateId);

  const steps = useMemo<WizardStep[]>(() => {
    if (!categories) return [];
    const base: WizardStep[] = [];

    // Step 1 & 2: First two categories
    if (categories[0])
      base.push({
        type: "category",
        data: categories[0],
        key: `cat_${categories[0].id}`,
      });
    if (categories[1])
      base.push({
        type: "category",
        data: categories[1],
        key: `cat_${categories[1].id}`,
      });

    // Location Steps
    base.push({ type: "country", key: "country" });
    base.push({ type: "state", key: "governorate" });
    base.push({ type: "city", key: "area" });

    // Remaining categories
    categories.slice(2).forEach((cat) => {
      base.push({ type: "category", data: cat, key: `cat_${cat.id}` });
    });

    // Media & Summary
    base.push({ type: "video", key: "video" });
    base.push({ type: "images", key: "images" });
    base.push({ type: "summary", key: "summary" });

    return base;
  }, [categories]);

  const totalSteps = steps.length;
  const rawStep = parseInt(searchParams.get("step") || "1");
  const step = isNaN(rawStep) ? 1 : Math.max(1, Math.min(totalSteps, rawStep));

  const [processing, setProcessing] = useState(false);
  const [published, setPublished] = useState(false);


  const setStep = (s: number) => router.push(`/post-ad?step=${s}`);

  const handleUpdate = (key: string, value: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue(key as any, value, { shouldValidate: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPostAdValue(key as any, value);
  };

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  const prev = () => {
    if (step > 1) setStep(step - 1);
  };
  const sel = (key: string, value: unknown) => {
    handleUpdate(key, value);
    setTimeout(next, 150);
  };

  const handlePublish = async () => {
    // Prevent publish if video is still uploading
    if (uploadState && (uploadState.status === 'uploading' || uploadState.status === 'merging')) {
      toast.warning('انتظر حتى ينتهي رفع الفيديو');
      return;
    }
    // Prevent publish if video upload errored
    if (uploadState && uploadState.status === 'error') {
      toast.error('فشل رفع الفيديو. يرجى إزالته والمحاولة مرة أخرى.');
      return;
    }

    setProcessing(true);
    try {
      const videoPaths: string[] =
        uploadState?.serverPath ? [uploadState.serverPath] : [];

      const success = await onSubmit(
        form.getValues() as unknown as PostAdValues,
        videoPaths,
      );

      if (success) {
        setPublished(true);
        resetPostAdForm();
        resetVideoUpload();
        setTimeout(() => router.push("/account"), 1500);
      }
    } finally {
      setProcessing(false);
    }
  };

  if (catsLoading || !categories || steps.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="mt-4 font-bold text-muted-foreground">
          جاري تحميل البيانات...
        </span>
      </div>
    );
  }

  const currentStepInfo = steps[step - 1] as WizardStep;

  return (
    <div
      className="min-h-screen bg-background flex flex-col relative overflow-hidden"
      dir="rtl"
    >
      <ProgressTop step={step} totalSteps={totalSteps} setStep={setStep} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            onSubmit(values as unknown as PostAdValues),
          )}
          className="flex-1 overflow-y-auto no-scrollbar pb-48 pt-10 md:pt-20"
        >
          <div className="max-w-4xl mx-auto px-5 w-full">
            {/* Dynamic Category Step */}
            {currentStepInfo.type === "category" && (
              <FormField
                control={form.control}
                name={`category_values_ids.${currentStepInfo.data.id}`}
                render={({ field }) => (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Title label={currentStepInfo.data.name} />

                    {currentStepInfo.data.type === "select" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentStepInfo.data.values.map((v: CategoryValue) => (
                          <Opt
                            key={v.id}
                            label={v.value}
                            selected={field.value === v.id}
                            onClick={() => sel(field.name, v.id)}
                          />
                        ))}
                      </div>
                    )}

                    {currentStepInfo.data.type === "boolean" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {currentStepInfo.data.values.map((v: CategoryValue) => (
                          <Opt
                            key={v.id}
                            label={v.value}
                            selected={field.value === v.id}
                            onClick={() => sel(field.name, v.id)}
                          />
                        ))}
                      </div>
                    )}

                    {currentStepInfo.data.type === "number" && (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (n) => (
                            <button
                              type="button"
                              key={n}
                              onClick={() => sel(field.name, n)}
                              className={cn(
                                "aspect-square rounded-2xl border-2 flex items-center justify-center text-xl font-bold transition-all active:scale-95",
                                field.value === n
                                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                                  : "bg-card border-border hover:border-primary/40",
                              )}
                            >
                              {n}
                            </button>
                          ),
                        )}
                      </div>
                    )}

                    {currentStepInfo.data.type === "range" && (
                      <div className="flex flex-col items-center justify-center gap-12 py-16 bg-card rounded-3xl border border-border shadow-md">
                        <div className="flex items-baseline gap-2">
                          <span className="text-6xl font-black text-primary">
                            {field.value || 50}
                          </span>
                          <span className="text-xl text-muted-foreground font-bold">
                            م²
                          </span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="2000"
                          step="5"
                          aria-label="اختيار المساحة"
                          value={field.value || 50}
                          onChange={(e) =>
                            handleUpdate(field.name, parseInt(e.target.value))
                          }
                          className="w-4/5 md:w-3/5 accent-[hsl(var(--primary))] h-3 rounded-lg appearance-none cursor-pointer bg-muted"
                        />
                        <div
                          className="flex justify-between w-4/5 md:w-3/5 text-xs text-muted-foreground font-bold"
                          dir="rtl"
                        >
                          <span>50 م²</span>
                          <span>1000 م²</span>
                          <span>2000 م²</span>
                        </div>
                      </div>
                    )}

                    <FormMessage className="text-center font-black mt-4" />
                  </div>
                )}
              />
            )}

            {/* Location Steps */}
            {currentStepInfo.type === "country" && (
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Title label="الدولة" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {countries?.map((c) => (
                        <Opt
                          key={c.id}
                          label={
                            <span className="flex items-center gap-3">
                              <Image
                                src={c.image}
                                width={32}
                                height={20}
                                alt={c.name}
                                className="rounded-sm object-cover"
                              />
                              {c.name}
                            </span>
                          }
                          selected={field.value === c.id}
                          onClick={() => {
                            handleUpdate("governorate", ""); // Reset child on change
                            handleUpdate("area", "");
                            sel("country", c.id);
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage className="text-center font-black mt-4" />
                  </div>
                )}
              />
            )}

            {currentStepInfo.type === "state" && (
              <FormField
                control={form.control}
                name="governorate"
                render={({ field }) => (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Title label="المحافظة / الولاية" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {states?.map((o: { id: number; name: string }) => (
                        <Opt
                          key={o.id}
                          label={o.name}
                          selected={field.value === o.id}
                          onClick={() => {
                            handleUpdate("area", "");
                            sel("governorate", o.id);
                          }}
                        />
                      ))}
                      {(!states || states.length === 0) && (
                        <div className="col-span-full py-20 text-center text-muted-foreground font-bold">
                          لا يوجد محافظات متوفرة لهذه الدولة
                        </div>
                      )}
                    </div>
                    <FormMessage className="text-center font-black mt-4" />
                  </div>
                )}
              />
            )}

            {currentStepInfo.type === "city" && (
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Title label="المنطقة / المدينة" />
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-[400px] md:h-auto overflow-y-auto no-scrollbar pb-10 text-right"
                      dir="rtl"
                    >
                      {cities?.map((o: { id: number; name: string }) => (
                        <Opt
                          key={o.id}
                          label={o.name}
                          selected={field.value === o.id}
                          onClick={() => sel("area", o.id)}
                        />
                      ))}
                      {(!cities || cities.length === 0) && (
                        <div className="col-span-full py-20 text-center text-muted-foreground font-bold">
                          لا يوجد مدن متوفرة لهذه المحافظة
                        </div>
                      )}
                    </div>
                    <FormMessage className="text-center font-black mt-4" />
                  </div>
                )}
              />
            )}

            {/* Media Uploads */}
            {currentStepInfo.type === "video" && (
              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Title label="ارفع فيديو" />
                    <VideoUploadPreview
                      file={field.value instanceof File ? field.value : null}
                      uploadStatus={uploadState?.status ?? 'idle'}
                      uploadProgress={uploadState?.progress ?? 0}
                      serverPath={uploadState?.serverPath ?? null}
                      uploadError={uploadState?.error ?? null}
                      onFileChange={(file) => {
                        handleUpdate("video", file);
                        // Start chunked upload immediately on file selection
                        uploadVideo(file).catch(() => {
                          // Error is already set in uploadState
                        });
                      }}
                      onRemove={() => {
                        handleUpdate("video", null);
                        resetVideoUpload();
                      }}
                    />
                  </div>
                )}
              />
            )}

            {currentStepInfo.type === "images" && (
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Title label="ارفع صور العقار" />
                    <ImageUploadGrid
                      images={field.value || []}
                      onChange={(imgs) => handleUpdate("images", imgs)}
                    />
                  </div>
                )}
              />
            )}

            {/* Summary */}
            {currentStepInfo.type === "summary" && (
              <div
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-right"
                dir="rtl"
              >
                <Title label="ملخص الاعلان" />
                <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-border mb-8 text-base flex flex-col gap-4">
                  {/* Dynamic Category Summary */}
                  {categories.map((cat) => {
                    const val = form.watch(`category_values_ids.${cat.id}`);
                    let displayVal = val;
                    if (cat.type === "select" || cat.type === "boolean") {
                      displayVal =
                        cat.values.find((v) => v.id === val)?.value || "—";
                    } else if (cat.type === "range") {
                      displayVal = `${val || 50} م²`;
                    } else if (cat.type === "number") {
                      displayVal = String(val || "—");
                    }

                    return (
                      <div
                        key={cat.id}
                        className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-muted-foreground font-bold">
                          {cat.name}
                        </span>
                        <span className="font-black text-foreground text-lg">
                          {displayVal}
                        </span>
                      </div>
                    );
                  })}

                  {/* Location Summary */}
                  <div className="flex justify-between items-center border-b border-border/50 pb-3">
                    <span className="text-muted-foreground font-bold">
                      الدولة
                    </span>
                    <span className="font-black text-foreground text-lg">
                      {countries?.find((c) => c.id === form.watch("country"))
                        ?.name || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/50 pb-3">
                    <span className="text-muted-foreground font-bold">
                      المحافظة
                    </span>
                    <span className="font-black text-foreground text-lg">
                      {states?.find((s) => s.id === form.watch("governorate"))
                        ?.name || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/50 pb-3">
                    <span className="text-muted-foreground font-bold">
                      المنطقة
                    </span>
                    <span className="font-black text-foreground text-lg">
                      {cities?.find((c) => c.id === form.watch("area"))?.name ||
                        "—"}
                    </span>
                  </div>

                  <div className="mt-4 pt-6 border-t-2 border-dashed border-border flex flex-col gap-3">
                    <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl">
                      <span className="font-black">قيمة النشر</span>
                      <span className="text-2xl font-black text-primary">
                        {settings?.publish_ad_fees ? `${settings.publish_ad_fees} د.ك` : '5 د.ك'}
                      </span>
                    </div>
                  </div>
                </div>
                {published && (
                  <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 text-white shadow-lg shadow-green-500/20">
                      <Check className="w-12 h-12 stroke-[4px]" />
                    </div>
                    <h3 className="text-2xl md:text-xl font-black mb-3">
                      تم النشر بنجاح!
                    </h3>
                    <p className="text-muted-foreground text-base max-w-xs text-center leading-relaxed">
                      جاري التوجيه إلى حسابك لإدارة الإعلان...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </Form>

      {/* Footer actions */}
      {!published && (() => {
        const hasBackBtn = step > 1;
        const isSummary = currentStepInfo.type === "summary";
        const needsNextBtn = !isSummary; // Always show 'Next' on non-summary steps
        
        // Only render footer if we actually have buttons to show
        if (!needsNextBtn && !hasBackBtn && !isSummary) return null;

        return (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-5 md:px-8 bg-linear-to-t from-background via-background to-transparent z-30 pointer-events-none">
            <div className="bg-card/80 backdrop-blur-xl border border-border p-4 md:p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row-reverse gap-3 pointer-events-auto">
              {isSummary ? (
                <div className="flex-1 flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={processing}
                    className="flex-1 py-4 md:py-5 bg-black text-white rounded-2xl md:rounded-3xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-zinc-800"
                  >
                    {processing ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "🍎 Apple Pay الدفع"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={processing}
                    className="flex-1 py-4 md:py-5 bg-primary text-primary-foreground rounded-2xl md:rounded-3xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-primary/90"
                  >
                    {processing ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Image
                          src={KNET_LOGO}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain bg-white rounded-full p-0.5"
                          alt="KNET"
                        />
                        كي نت
                      </>
                    )}
                  </button>
                </div>
              ) : (
                needsNextBtn && (
                  <button
                    type="button"
                    onClick={next}
                    className="flex-2 py-4 md:py-5 bg-primary text-primary-foreground rounded-2xl md:rounded-3xl font-black text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    التالي <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                )
              )}

              {hasBackBtn && (
                <button
                  type="button"
                  onClick={prev}
                  disabled={processing}
                  className="flex-1 py-4 md:py-5 bg-muted/50 border border-border text-foreground rounded-2xl md:rounded-3xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 hover:bg-muted flex items-center justify-center gap-2"
                >
                  <ChevronRight className="w-5 h-5" /> رجوع
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default function PostAdPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PostAdWizard />
    </Suspense>
  );
}
