import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'subtle';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = ''
}: CardProps) {
  const baseClasses = "bg-white rounded-lg border";

  const variantClasses = {
    default: "shadow-md border-gray-200",
    hover: "shadow-md border-gray-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200",
    subtle: "shadow-sm border-slate-200"
  };

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].join(' ');

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}