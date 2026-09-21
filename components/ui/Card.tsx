import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "emergency";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-[#0D1B2A] border-[#203449]",
    glass: "bg-[#0D1B2A]/75 border-[#4DA3FF]/10 backdrop-blur-xl",
    emergency:
      "bg-[#0D1B2A] border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.06)]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}