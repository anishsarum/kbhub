import { ReactNode } from "react";
import { LoadingSpinner } from "./icons";

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'danger-outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

  const variantClasses = {
    primary: "bg-emerald-600 text-white border-transparent hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:hover:bg-emerald-400",
    secondary: "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 focus:ring-slate-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",
    danger: "bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed disabled:hover:bg-red-400",
    outline: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
    "danger-outline": "bg-white text-red-700 border-red-300 hover:bg-red-50 focus:ring-red-500 disabled:bg-red-100 disabled:text-red-400 disabled:cursor-not-allowed"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm"
  };

  const isDisabled = disabled || loading;

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(' ');

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={combinedClasses}
    >
      {loading && (
        <LoadingSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
      )}
      {children}
    </button>
  );
}