import { cn } from "@/lib/utils";

export function TicketBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center justify-center rounded-none border-2 border-foreground px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap",
        className,
      )}
    >
      {label}
    </span>
  );
}
