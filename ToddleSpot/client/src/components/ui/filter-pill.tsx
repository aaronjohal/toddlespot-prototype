import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterPillProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterPill({
  label,
  icon,
  isActive = false,
  onClick,
  className,
}: FilterPillProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        "rounded-full inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-teal-500 bg-opacity-10 text-teal-700 border-teal-500"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
        className
      )}
    >
      {icon && <span className="text-teal-500">{icon}</span>}
      {label}
    </Button>
  );
}
