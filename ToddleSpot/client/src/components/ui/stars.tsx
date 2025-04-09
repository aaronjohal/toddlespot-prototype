import React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  totalStars?: number;
  className?: string;
  size?: number;
}

export function Stars({ rating, totalStars = 5, className, size = 16 }: StarsProps) {
  // Calculate the number of full stars, half stars, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center", className)}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="text-teal-500 fill-teal-500"
          size={size}
        />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <StarHalf
          className="text-teal-500 fill-teal-500"
          size={size}
        />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="text-gray-300"
          size={size}
        />
      ))}
    </div>
  );
}
