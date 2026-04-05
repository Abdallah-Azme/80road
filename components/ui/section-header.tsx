import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeaderProps {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-8 md:mb-12", className)} dir="rtl">
      <div className="flex flex-col gap-1.5 border-r-4 border-primary/40 pr-4 md:pr-6 text-right">
        <h2 id={id} className="text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center h-full pt-1">
          {action}
        </div>
      )}
    </div>
  );
}
