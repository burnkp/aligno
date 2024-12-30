"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  fullScreen?: boolean;
  className?: string;
  text?: string;
}

export function LoadingState({ 
  fullScreen = false, 
  className,
  text = "Loading..." 
}: LoadingStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      fullScreen && "h-screen w-screen fixed inset-0 bg-background/80 backdrop-blur-sm",
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  );
} 