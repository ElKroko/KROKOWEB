"use client";

import { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const getBaseStyles = () => "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-white hover:bg-primary-dark focus:ring-primary";
      case "secondary":
        return "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary";
      case "outline":
        return "bg-transparent border border-primary-light text-primary-light hover:bg-primary/10 focus:ring-primary";
      case "ghost":
        return "bg-transparent hover:bg-primary/10 text-primary-light focus:ring-primary";
      default:
        return "bg-primary text-white hover:bg-primary-dark focus:ring-primary";
    }
  };
  
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-sm py-1.5 px-3";
      case "md":
        return "text-base py-2 px-4";
      case "lg":
        return "text-lg py-2.5 px-5";
      default:
        return "text-base py-2 px-4";
    }
  };
  
  const buttonStyles = `
    ${getBaseStyles()} 
    ${getVariantStyles()} 
    ${getSizeStyles()} 
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50 pointer-events-none" : ""}
    ${className}
  `;

  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonStyles}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
    >
      {children}
    </button>
  );
}