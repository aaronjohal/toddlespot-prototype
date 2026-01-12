import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureBadge } from "@/components/ui/feature-badge";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Venue } from "@shared/schema";

// Icons for baby-friendly features
import {
  Baby,
  Accessibility,
  Volume2,
  User,
  Coffee,
  Milk
} from "lucide-react";

interface VenueCardProps {
  venue: Venue;
  isFavorite?: boolean;
  distance?: string;
  className?: string;
  onClick?: () => void;
}

export function VenueCard({
  venue,
  isFavorite = false,
  distance,
  className,
  onClick,
}: VenueCardProps) {
  const [isInFavorites, setIsInFavorites] = React.useState(isFavorite);

  // Get top 3 most significant features
  const getTopFeatures = () => {
    const features = [];

    if (venue.changingFacilities) features.push({
      label: "Changing Station",
      icon: <Baby className="h-3.5 w-3.5" />
    });

    if (venue.pramAccess) features.push({
      label: "Pram Access",
      icon: <Accessibility className="h-3.5 w-3.5" />
    });

    if (venue.quietSpace) features.push({
      label: "Quiet Space",
      icon: <Volume2 className="h-3.5 w-3.5" />
    });

    if (venue.highChairs && features.length < 3) features.push({
      label: "High Chairs",
      icon: <User className="h-3.5 w-3.5" />
    });

    if (venue.bottleWarming && features.length < 3) features.push({
      label: "Bottle Warming",
      icon: <Coffee className="h-3.5 w-3.5" />
    });

    if (venue.breastfeedingArea && features.length < 3) features.push({
      label: "Breastfeeding Area",
      icon: <Milk className="h-3.5 w-3.5" />
    });

    return features.slice(0, 3);
  };

  const topFeatures = getTopFeatures();

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInFavorites(!isInFavorites);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden border border-gray-100 shadow-sm hover:shadow transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={venue.photos?.[0] || "https://via.placeholder.com/500x200?text=No+Image"}
          alt={venue.name} 
          className="w-full h-40 object-cover"
        />
        
        <button 
          className={cn(
            "absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          )}
          onClick={handleFavoriteToggle}
          aria-label={isInFavorites ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-colors",
              isInFavorites ? "text-rose-500 fill-rose-500" : "text-gray-400 hover:text-rose-500"
            )} 
          />
        </button>
        
        {distance && (
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-lg text-xs font-medium">
            <span>{distance}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800">{venue.name}</h3>
          <div className="flex items-center bg-teal-500 text-white rounded px-2 py-0.5 text-sm">
            <span className="font-medium">{venue.overallRating?.toFixed(1) || 'N/A'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-1">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-2">
          {venue.type} • {distance ? `${distance} away` : 'Family-friendly'}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mt-1">
          {topFeatures.map((feature, index) => (
            <FeatureBadge
              key={index}
              label={feature.label}
              icon={feature.icon}
              size="sm"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
