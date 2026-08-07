import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 1, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{ aspectRatio: ratio }}
        {...props}
      />
    );
  }
);

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
