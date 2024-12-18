"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCardContext = React.createContext<{
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
} | null>(null);

const HoverCard = ({
  open,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  children,
  ...props
}: HoverCardProps) => {
  const [isOpen, setIsOpen] = React.useState(open);
  const openTimeout = React.useRef<NodeJS.Timeout>();
  const closeTimeout = React.useRef<NodeJS.Timeout>();

  const handleMouseEnter = React.useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    openTimeout.current = setTimeout(() => {
      setIsOpen(true);
      onOpenChange?.(true);
    }, openDelay);
  }, [openDelay, onOpenChange]);

  const handleMouseLeave = React.useCallback(() => {
    if (openTimeout.current) {
      clearTimeout(openTimeout.current);
    }
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
      onOpenChange?.(false);
    }, closeDelay);
  }, [closeDelay, onOpenChange]);

  React.useEffect(() => {
    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  return (
    <HoverCardContext.Provider value={{ handleMouseEnter, handleMouseLeave }}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Popover>
    </HoverCardContext.Provider>
  );
};

const HoverCardTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(HoverCardContext);
  if (!context) {
    throw new Error("HoverCardTrigger must be used within a HoverCard");
  }
  const { handleMouseEnter, handleMouseLeave } = context;

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
    </div>
  );
});
HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
