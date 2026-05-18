"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  // Primary: illuminated gold — gradient fill, inner highlight, outer bloom
  primary:
    "relative bg-gradient-to-b from-gold-glow via-gold-leaf to-gold-deep text-night-void font-semibold tracking-wide " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_16px_-2px_rgba(201,169,97,0.35),0_0_0_1px_rgba(201,169,97,0.6)] " +
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_24px_-2px_rgba(255,217,106,0.55),0_0_0_1px_rgba(255,217,106,0.8)] " +
    "active:translate-y-px transition-all duration-200",

  // Secondary: gold-rimmed transparent — for low-key actions
  secondary:
    "bg-night-veil/40 backdrop-blur-sm text-moonlight border border-gold-leaf/35 " +
    "hover:bg-night-veil/60 hover:border-gold-leaf/60 hover:text-gold-pale " +
    "transition-colors duration-200",

  // Ghost: text-only with mysterious hover
  ghost:
    "text-text-muted hover:text-gold-pale hover:bg-night-veil/30 transition-colors duration-200",

  // Danger: deep crimson, restrained
  danger:
    "bg-gradient-to-b from-[#a8344a] to-[#6b1e2c] text-moonlight font-semibold " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_12px_-2px_rgba(139,44,59,0.5)] " +
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_18px_-2px_rgba(139,44,59,0.7)] " +
    "transition-all duration-200",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3.5 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-body disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-leaf/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night-void ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            aria-hidden="true"
          />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
