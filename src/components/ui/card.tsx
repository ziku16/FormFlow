import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div {...props} className={cn("card", className)} />;
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div {...props} className={cn("panel-head", className)} />;
}

export function CardBody({ className, ...props }: CardProps) {
  return <div {...props} className={cn("panel-pad", className)} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div {...props} className={cn("panel-footer", className)} />;
}
