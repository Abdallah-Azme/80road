"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { ProgressTop } from "@/features/post-ad/components/wizard/shared";
import { WizardFooter } from "@/features/post-ad/components/wizard/WizardFooter";
import { WizardStepsRenderer } from "@/features/post-ad/components/wizard/WizardStepsRenderer";
import { useWizardSteps } from "@/features/post-ad/hooks/useWizardSteps";

function PostAdWizard() {
  const {
    step,
    steps,
    totalSteps,
    catsLoading,
    categories,
    countries,
    states,
    cities,
    settings,
    form,
    handlePublish,
    processing,
    published,
    uploadState,
    uploadVideo,
    resetVideoUpload,
    handleUpdate,
    handleStepClick,
    next,
    prev,
    sel,
  } = useWizardSteps();

  if (catsLoading || !categories || steps.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="mt-4 font-bold text-muted-foreground">جاري تحميل البيانات...</span>
      </div>
    );
  }

  const currentStepInfo = steps[step - 1];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden" dir="rtl">
      <ProgressTop step={step} totalSteps={totalSteps} setStep={handleStepClick} />

      <Form {...form}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 overflow-y-auto no-scrollbar pb-48 pt-10 md:pt-20"
        >
          <div className="max-w-4xl mx-auto px-5 w-full">
            <WizardStepsRenderer
              currentStepInfo={currentStepInfo}
              form={form}
              handleUpdate={handleUpdate}
              sel={sel}
              countries={countries}
              states={states}
              cities={cities}
              categories={categories}
              settings={settings}
              uploadState={uploadState}
              uploadVideo={uploadVideo}
              resetVideoUpload={resetVideoUpload}
              published={published}
              processing={processing}
            />
          </div>
        </form>
      </Form>

      <WizardFooter
        step={step}
        currentStepInfo={currentStepInfo}
        processing={processing}
        published={published}
        handlePublish={handlePublish}
        next={next}
        prev={prev}
      />
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
