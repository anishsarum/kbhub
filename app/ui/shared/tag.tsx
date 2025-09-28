import { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  size?: "sm" | "md";
  className?: string;
}

export function Tag({ children, size = "md", className = "" }: TagProps) {
  const baseClasses = "inline-block bg-emerald-100 text-emerald-800 rounded-full";

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1"
  };

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    className
  ].join(" ");

  return <span className={combinedClasses}>{children}</span>;
}