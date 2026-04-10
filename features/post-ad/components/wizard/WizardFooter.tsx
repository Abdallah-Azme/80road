import React from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { CustomImage as Image } from "@/shared/components/custom-image";
import { WizardStep } from "@/features/post-ad/types/wizard";

const KNET_LOGO =
  "https://media.licdn.com/dms/image/v2/D4D0BAQFazp_I3lLeQg/company-logo_200_200/company-logo_200_200/0/1715599858189/the_shared_electronic_banking_services_co_knet_logo?e=2147483647&v=beta&t=FfjCLbNIUGrTCTi-tI5nXSNP9B4AcOJbWsFqV0bSWcM";

export function WizardFooter({
  step,
  currentStepInfo,
  processing,
  published,
  handlePublish,
  next,
  prev,
}: {
  step: number;
  currentStepInfo: WizardStep;
  processing: boolean;
  published: boolean;
  handlePublish: () => void;
  next: () => void;
  prev: () => void;
}) {
  if (published) return null;

  const hasBackBtn = step > 1;
  const isSummary = currentStepInfo.type === "summary";
  const needsNextBtn = !isSummary;

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
}
