import { cn } from "@/lib/cn";

export type ProgressProps = {
  value: number;
  max?: number;
  label: string;
  className?: string;
};

export function Progress({
  value,
  max = 100,
  label,
  className,
}: ProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value)
    ? Math.max(0, Math.min(value, safeMax))
    : 0;
  return (
    <div
      className={cn("progress", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
    >
      <span style={{ width: `${(safeValue / safeMax) * 100}%` }} />
    </div>
  );
}
