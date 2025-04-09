import React from "react";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function Logo({ size = "medium", className = "" }: LogoProps) {
  const sizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-3xl"
  };
  
  return (
    <div className={`font-bold ${sizeClasses[size]} ${className}`}>
      <span className="text-teal-500">toddle</span>
      <span className="text-coral-500">Spot</span>
    </div>
  );
}
