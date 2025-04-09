import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Offer } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfferCardProps {
  offer: Offer;
  featured?: boolean;
  className?: string;
}

export function OfferCard({ offer, featured = false, className }: OfferCardProps) {
  const getOfferTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'class':
        return 'CLASS';
      case 'activity':
        return 'ACTIVITY';
      case 'product':
        return 'PRODUCT';
      case 'meal':
        return 'MEAL DEAL';
      default:
        return type.toUpperCase();
    }
  };

  const getValidityText = () => {
    if (offer.validFrom && offer.validTo) {
      const from = new Date(offer.validFrom);
      const to = new Date(offer.validTo);
      
      if (featured) {
        return `Valid until: ${to.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      }
      
      // Check if specific conditions in terms field
      if (offer.terms && offer.terms.toLowerCase().includes('weekday')) {
        return 'Valid: Weekdays';
      }
      
      return `Valid: ${from.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${to.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
    }
    
    return '';
  };

  const getAgeRangeText = () => {
    if (offer.targetAges && offer.targetAges.length > 0) {
      return `For ages: ${offer.targetAges.join(', ')}`;
    }
    return '';
  };

  if (featured) {
    return (
      <div className={cn("bg-rose-500 bg-opacity-10 rounded-xl p-4", className)}>
        <div className="flex items-start gap-4">
          <img 
            src={offer.imageUrl || "https://via.placeholder.com/100?text=No+Image"}
            alt={offer.title}
            className="w-24 h-24 rounded-lg object-cover"
          />
          
          <div className="flex-1">
            <Badge className="bg-rose-500 bg-opacity-20 text-rose-700 hover:bg-rose-500 hover:bg-opacity-30">
              FEATURED
            </Badge>
            <h3 className="font-bold text-gray-800 mt-1">{offer.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
            <div className="mt-2">
              <span className="text-xs font-medium text-gray-500">{getValidityText()}</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full mt-3 bg-rose-500 hover:bg-rose-600 text-white"
          asChild
        >
          <a href={offer.link} target="_blank" rel="noopener noreferrer">
            View Offer
          </a>
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn("overflow-hidden border border-gray-100 shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <img 
            src={offer.imageUrl || "https://via.placeholder.com/100?text=No+Image"}
            alt={offer.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          
          <div className="flex-1">
            <Badge className="bg-teal-500 bg-opacity-10 text-teal-700 hover:bg-teal-500 hover:bg-opacity-30">
              {getOfferTypeLabel(offer.type)}
            </Badge>
            <h3 className="font-semibold text-gray-800 mt-1">{offer.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{offer.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">
                {getAgeRangeText() || getValidityText()}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-teal-500 font-medium hover:text-teal-600 p-0 h-auto"
                asChild
              >
                <a href={offer.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  View <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
