"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error natively so we can see it in browser console
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8" dir="rtl">
      <h2 className="mb-4 text-2xl font-bold">عذراً، حدث خطأ غير متوقع!</h2>
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-left w-full max-w-2xl mb-8 font-mono text-sm overflow-auto">
        {error.message || "Unknown error occurred"}
        {error.stack && (
          <pre className="mt-4 text-xs opacity-80 whitespace-pre-wrap">{error.stack}</pre>
        )}
      </div>
      <Button onClick={() => reset()} variant="default">
        إعادة المحاولة
      </Button>
    </div>
  );
}
