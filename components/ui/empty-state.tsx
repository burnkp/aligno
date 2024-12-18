"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onClick?: () => void
  image?: string
  className?: string
}

export const EmptyState = ({
  title = "No results found",
  description = "Try adjusting your search or filters",
  actionLabel,
  actionHref,
  onClick,
  image = "/empty-state.svg",
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn("flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed", className)}>
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {image && (
          <div className="relative mb-4 h-32 w-32">
            <Image
              src={image}
              alt="Empty State"
              fill
              className="object-contain"
            />
          </div>
        )}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        {actionLabel && (onClick || actionHref) && (
          <Button
            onClick={onClick}
            variant="outline"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
} 