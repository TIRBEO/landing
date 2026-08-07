"use client";

import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
          {
            "bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]": variant === "default",
            "bg-[var(--color-success-subtle)] text-[var(--color-success-default)]": variant === "success",
            "bg-[var(--color-warning-subtle)] text-[var(--color-warning-default)]": variant === "warning",
            "bg-[var(--color-error-subtle)] text-[var(--color-error-default)]": variant === "error",
            "bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)]": variant === "info",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
