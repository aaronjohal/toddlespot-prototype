import React from "react";
import { Stars } from "./stars";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  label: string;
  rating: number;
  showValue?: boolean;
  className?: string;
}

export function RatingDisplay({
  label,
  rating,
  showValue = true,
  className,
}: RatingDisplayProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center">
        <Stars rating={rating} size={16} />
        {showValue && (
          <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
        )}
      </div>
    </div>
  );
}
