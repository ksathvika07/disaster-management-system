import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "emergency"
  | "outline"
  | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "bg-[#4DA3FF] text-white hover:bg-[#2477C8] shadow-lg shadow-blue-500/10",
      secondary:
        "bg-[#13263A] text-white hover:bg-[#1A344D] border border-[#203449]",
      emergency:
        "bg-[#EF4444] text-white hover:bg-[#B91C1C] shadow-lg shadow-red-500/10",
      outline:
        "bg-transparent text-white border border-[#2B435B] hover:bg-[#13263A]",
      ghost:
        "bg-transparent text-[#A8B5C4] hover:bg-[#13263A] hover:text-white",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-13 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/50",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";