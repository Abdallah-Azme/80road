import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWizardStore } from "@/stores/wizard.store";
import { usePostAdForm } from "@/features/post-ad/hooks/usePostAdForm";
import { useCategories } from "@/features/post-ad/hooks/useCategories";
import { useCountries, useStates, useCities } from "@/shared/hooks/useLocation";
import { WizardStep } from "@/features/post-ad/types/wizard";
import { toast } from "sonner";
import { useChunkedVideoUpload } from "./useChunkedVideoUpload";
import { useSettings } from "@/shared/hooks/useSettings";

export function useWizardSteps() {
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

    if (categories[0])
      base.push({ type: "category", data: categories[0], key: `cat_${categories[0].id}` });
    if (categories[1])
      base.push({ type: "category", data: categories[1], key: `cat_${categories[1].id}` });

    base.push({ type: "country", key: "country" });
    base.push({ type: "state", key: "governorate" });
    base.push({ type: "city", key: "area" });

    categories.slice(2).forEach((cat) => {
      base.push({ type: "category", data: cat, key: `cat_${cat.id}` });
    });

    base.push({ type: "video", key: "video" });
    base.push({ type: "images", key: "images" });
    base.push({ type: "details", key: "details" });
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

  const validateCurrentStep = (): boolean => {
    const currentStepInfo = steps[step - 1];
    if (!currentStepInfo) return true;

    if (currentStepInfo.type === "category") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const val = form.getValues(`category_values_ids.${currentStepInfo.data.id}` as any);
      return val !== undefined && val !== null && val !== "";
    }
    if (currentStepInfo.type === "country") {
      return !!form.getValues("country");
    }
    if (currentStepInfo.type === "state") {
      if (!states || states.length === 0) return true;
      return !!form.getValues("governorate");
    }
    if (currentStepInfo.type === "city") {
      if (!cities || cities.length === 0) return true;
      return !!form.getValues("area");
    }
    if (currentStepInfo.type === "details") {
      const price = form.getValues("price");
      return !!price && Number(price) > 0;
    }
    return true;
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep > step) {
      if (!validateCurrentStep()) {
        toast.error("يرجى تعبئة الخيارات المطلوبة قبل المتابعة");
        return;
      }
      if (targetStep > step + 1) {
        toast.error("الرجاء إكمال الخطوة التالية أولاً");
        return;
      }
    }
    setStep(targetStep);
  };

  const next = () => {
    if (!validateCurrentStep()) {
      toast.error("يرجى تعبئة الخيارات المطلوبة قبل المتابعة");
      return;
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  const sel = (key: string, value: unknown) => {
    handleUpdate(key, value);
    setTimeout(() => {
      if (step < totalSteps) setStep(step + 1);
    }, 150);
  };

  const handlePublish = async () => {
    if (uploadState && (uploadState.status === 'uploading' || uploadState.status === 'merging')) {
      toast.warning('انتظر حتى ينتهي رفع الفيديو');
      return;
    }
    if (uploadState && uploadState.status === 'error') {
      toast.error('فشل رفع الفيديو. يرجى إزالته والمحاولة مرة أخرى.');
      return;
    }

    setProcessing(true);
    try {
      const videoPaths: string[] = uploadState?.serverPath ? [uploadState.serverPath] : [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const success = await onSubmit(form.getValues() as any, videoPaths);

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

  return {
    step,
    steps,
    totalSteps,
    categories,
    catsLoading,
    countries,
    states,
    cities,
    settings,
    form,
    onSubmit, // maybe not needed if handlePublish is here
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
    router
  };
}

