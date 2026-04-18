import { Status } from "@/data/cases";
import { cn } from "@/lib/utils";

const MAP: Record<Status, string> = {
  active:  "bg-brand-green-light text-brand-green-dark",
  overdue: "bg-brand-red-light text-brand-red-dark",
  hold:    "bg-brand-amber-light text-brand-amber-dark",
  urgent:  "bg-brand-red-light text-brand-red-dark",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase tracking-wide",
      MAP[status],
      className
    )}>
      {status}
    </span>
  );
}
