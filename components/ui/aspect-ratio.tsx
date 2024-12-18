"use client";

import { cn } from "@/lib/utils";

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export function AspectRatio({ ratio = 1, className, ...props }: AspectRatioProps) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
      {...props}
    >
      <div className="absolute inset-0">{props.children}</div>
    </div>
  );
}
