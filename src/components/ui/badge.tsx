import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "success" | "warning" | "error" | "neutral" | "info";
const tones: Record<BadgeTone, string> = {
  success: "",
  warning: "amber",
  error: "red",
  neutral: "gray",
  info: "info",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone };

export function Badge({ tone = "success", className, ...props }: BadgeProps) {
  return <span {...props} className={cn("pill", tones[tone], className)} />;
}
