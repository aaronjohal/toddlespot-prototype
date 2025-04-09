import React from "react";
import { cn } from "@/lib/utils";

interface FeatureBadgeProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FeatureBadge({
  label,
  icon,
  className,
  size = "md",
}: FeatureBadgeProps) {
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-sm"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-teal-500 bg-opacity-10 font-medium text-teal-700",
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </span>
  );
}
