import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";

export type NoticeProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  tone?: "info" | "success" | "warning" | "error";
  title?: string;
  icon?: IconName;
  children: ReactNode;
};

export function Notice({
  tone = "info",
  title,
  icon,
  children,
  className,
  ...props
}: NoticeProps) {
  return (
    <div
      {...props}
      className={cn("notice", tone !== "info" && tone, className)}
    >
      <Icon name={icon ?? (tone === "success" ? "check" : "info")} />
      <div>
        {title && <strong>{title}</strong>}
        {children}
      </div>
    </div>
  );
}
