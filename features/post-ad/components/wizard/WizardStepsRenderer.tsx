import React from "react";
import { FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Title, Opt } from "./shared";
import { CustomImage as Image } from "@/shared/components/custom-image";
import { VideoUploadPreview, ImageUploadGrid } from "@/features/post-ad/components/MediaPreview";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WizardStepsRenderer({ currentStepInfo, form, handleUpdate, sel, countries, states, cities, categories, settings, uploadState, uploadVideo, resetVideoUpload, published, processing }: any) {
  return (
    <>
      {currentStepInfo.type === "category" && (
        <FormField
          control={form.control}
          name={`category_values_ids.${currentStepInfo.data.id}`}
          render={({ field }) => (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Title label={currentStepInfo.data.name} />
              {(currentStepInfo.data.type === "select" || currentStepInfo.data.type === "boolean") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentStepInfo.data.values.map((v: any) => (
                    <Opt key={v.id} label={v.value} selected={field.value === v.id} onClick={() => sel(field.name, v.id)} />
                  ))}
                </div>
              )}
              {currentStepInfo.data.type === "number" && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => sel(field.name, n)}
                      className={cn(
                        "aspect-square rounded-2xl border-2 flex items-center justify-center text-xl font-bold transition-all active:scale-95",
                        field.value === n ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-card border-border hover:border-primary/40"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
              {currentStepInfo.data.type === "range" && (
                <div className="flex flex-col items-center justify-center gap-12 py-16 bg-card rounded-3xl border border-border shadow-md">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-primary">{field.value || 50}</span>
                    <span className="text-xl text-muted-foreground font-bold">م²</span>
                  </div>
                  <input
                    type="range" min="50" max="2000" step="5"
                    value={field.value || 50}
                    onChange={(e) => handleUpdate(field.name, parseInt(e.target.value))}
                    className="w-4/5 md:w-3/5 accent-[hsl(var(--primary))] h-3 rounded-lg appearance-none cursor-pointer bg-muted"
                  />
                  <div className="flex justify-between w-4/5 md:w-3/5 text-xs text-muted-foreground font-bold" dir="rtl">
                    <span>50 م²</span><span>1000 م²</span><span>2000 م²</span>
                  </div>
                </div>
              )}
              <FormMessage className="text-center font-black mt-4" />
            </div>
          )}
        />
      )}

      {currentStepInfo.type === "country" && (
        <FormField control={form.control} name="country" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="الدولة" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries?.map((c: any) => (
                <Opt key={c.id} label={<span className="flex items-center gap-3"><Image src={c.image} width={32} height={20} alt={c.name} className="rounded-sm object-cover" />{c.name}</span>} selected={field.value === c.id} onClick={() => { handleUpdate("governorate", ""); handleUpdate("area", ""); sel("country", c.id); }} />
              ))}
            </div>
            <FormMessage className="text-center font-black mt-4" />
          </div>
        )} />
      )}

      {currentStepInfo.type === "state" && (
        <FormField control={form.control} name="governorate" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="المحافظة / الولاية" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {states?.map((o: any) => (
                <Opt key={o.id} label={o.name} selected={field.value === o.id} onClick={() => { handleUpdate("area", ""); sel("governorate", o.id); }} />
              ))}
              {(!states || states.length === 0) && <div className="col-span-full py-20 text-center text-muted-foreground font-bold">لا يوجد محافظات متوفرة لهذه الدولة</div>}
            </div>
            <FormMessage className="text-center font-black mt-4" />
          </div>
        )} />
      )}

      {currentStepInfo.type === "city" && (
        <FormField control={form.control} name="area" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="المنطقة / المدينة" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-[400px] md:h-auto overflow-y-auto no-scrollbar pb-10 text-right" dir="rtl">
              {cities?.map((o: any) => (
                <Opt key={o.id} label={o.name} selected={field.value === o.id} onClick={() => sel("area", o.id)} />
              ))}
              {(!cities || cities.length === 0) && <div className="col-span-full py-20 text-center text-muted-foreground font-bold">لا يوجد مدن متوفرة لهذه المحافظة</div>}
            </div>
            <FormMessage className="text-center font-black mt-4" />
          </div>
        )} />
      )}

      {currentStepInfo.type === "video" && (
        <FormField control={form.control} name="video" render={({ field }) => (
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
                uploadVideo(file).catch(() => {});
              }}
              onRemove={() => { handleUpdate("video", null); resetVideoUpload(); }}
            />
          </div>
        )} />
      )}

      {currentStepInfo.type === "images" && (
        <FormField control={form.control} name="images" render={({ field }) => (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Title label="ارفع صور العقار" />
            <ImageUploadGrid images={field.value || []} onChange={(imgs) => handleUpdate("images", imgs)} />
          </div>
        )} />
      )}

      {currentStepInfo.type === "details" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
          <Title label="تفاصيل الإعلان" />
          <div className="flex flex-col gap-6">
            <FormField control={form.control} name="price" render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FormLabel className="text-sm font-black text-foreground uppercase tracking-wide">السعر (د.ك) <span className="text-red-500">*</span></FormLabel>
                <FormControl><Input {...field} type="number" min="1" placeholder="مثال: 50000" className="h-14 rounded-2xl border-2 text-base font-black focus:ring-4 focus:ring-primary/10" /></FormControl>
                <FormMessage />
              </div>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FormLabel className="text-sm font-black text-muted-foreground uppercase tracking-wide">عنوان الإعلان (اختياري)</FormLabel>
                <FormControl><Input {...field} placeholder="مثال: شقة للإيجار في السالمية - 3 غرف" className="h-14 rounded-2xl border-2 text-base font-medium focus:ring-4 focus:ring-primary/10" /></FormControl>
                <FormMessage />
              </div>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <div className="flex flex-col gap-2">
                <FormLabel className="text-sm font-black text-muted-foreground uppercase tracking-wide">وصف الإعلان (اختياري)</FormLabel>
                <FormControl><textarea {...field} rows={5} placeholder="اكتب وصفاً تفصيلياً للعقار..." className="w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-base font-medium resize-none outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all" /></FormControl>
                <FormMessage />
              </div>
            )} />
          </div>
        </div>
      )}

      {currentStepInfo.type === "summary" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-right" dir="rtl">
          <Title label="ملخص الاعلان" />
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-border mb-8 text-base flex flex-col gap-4">
            {categories.map((cat: any) => {
              const val = form.watch(`category_values_ids.${cat.id}`);
              let displayVal = val;
              if (cat.type === "select" || cat.type === "boolean") displayVal = cat.values.find((v: any) => v.id === val)?.value || "—";
              else if (cat.type === "range") displayVal = `${val || 50} م²`;
              else if (cat.type === "number") displayVal = String(val || "—");
              return (
                <div key={cat.id} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <span className="text-muted-foreground font-bold">{cat.name}</span>
                  <span className="font-black text-foreground text-lg">{displayVal}</span>
                </div>
              );
            })}
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-muted-foreground font-bold">الدولة</span>
              <span className="font-black text-foreground text-lg">{countries?.find((c: any) => c.id === form.watch("country"))?.name || "—"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-muted-foreground font-bold">المحافظة</span>
              <span className="font-black text-foreground text-lg">{states?.find((s: any) => s.id === form.watch("governorate"))?.name || "—"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-muted-foreground font-bold">المنطقة</span>
              <span className="font-black text-foreground text-lg">{cities?.find((c: any) => c.id === form.watch("area"))?.name || "—"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="text-muted-foreground font-bold">السعر</span>
              <span className="font-black text-foreground text-lg">{form.watch("price") ? `${form.watch("price")} د.ك` : "—"}</span>
            </div>
            <div className="mt-4 pt-6 border-t-2 border-dashed border-border flex flex-col gap-3">
              <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl">
                <span className="font-black">قيمة النشر</span>
                <span className="text-2xl font-black text-primary">{settings?.publish_ad_fees ? `${settings.publish_ad_fees} د.ك` : '5 د.ك'}</span>
              </div>
            </div>
          </div>
          {published && (
            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 text-white shadow-lg shadow-green-500/20">
                <Check className="w-12 h-12 stroke-[4px]" />
              </div>
              <h3 className="text-2xl md:text-xl font-black mb-3">تم النشر بنجاح!</h3>
              <p className="text-muted-foreground text-base max-w-xs text-center leading-relaxed">جاري التوجيه إلى حسابك لإدارة الإعلان...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
