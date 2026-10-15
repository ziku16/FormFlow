import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "default" | "sm";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "default",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(
        "btn",
        `btn-${variant}`,
        size === "sm" && "btn-sm",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  );
}

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  label: string;
  children: ReactNode;
};

export function IconButton({
  label,
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn("iconbtn", className)}
      aria-label={label}
    >
      {children}
    </button>
  );
}
