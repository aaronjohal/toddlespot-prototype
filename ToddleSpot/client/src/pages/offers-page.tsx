import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterPill } from "@/components/ui/filter-pill";
import { OfferCard } from "@/components/offer-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Offer } from "@shared/schema";

export default function OffersPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Fetch all offers
  const { data: offers, isLoading: offersLoading } = useQuery<Offer[]>({
    queryKey: ["/api/offers", activeFilter],
    queryFn: async () => {
      const url = activeFilter
        ? `/api/offers?type=${encodeURIComponent(activeFilter)}`
        : "/api/offers";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    }
  });
  
  // Fetch featured offers
  const { data: featuredOffers, isLoading: featuredLoading } = useQuery<Offer[]>({
    queryKey: ["/api/offers/featured"],
    queryFn: async () => {
      const res = await fetch("/api/offers/featured");
      if (!res.ok) throw new Error("Failed to fetch featured offers");
      return res.json();
    }
  });
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };
  
  // Filter types
  const offerTypes = ["Classes", "Activities", "Products", "Meals"];
  
  return (
    <div className="p-4">
      {/* Filter bar */}
      <div className="mb-4 overflow-x-auto whitespace-nowrap py-1 -mx-4 px-4">
        <div className="inline-flex gap-2">
          <FilterPill
            label="All Offers"
            isActive={activeFilter === null}
            onClick={() => setActiveFilter(null)}
          />
          
          {offerTypes.map((type) => (
            <FilterPill
              key={type}
              label={type}
              isActive={activeFilter === type.toLowerCase()}
              onClick={() => handleFilterChange(type.toLowerCase())}
            />
          ))}
        </div>
      </div>
      
      {/* Featured offers */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Featured Offers</h2>
        </div>
        
        {featuredLoading ? (
          <Skeleton className="h-48 w-full rounded-xl mb-5" />
        ) : (
          featuredOffers && featuredOffers.length > 0 && (
            <OfferCard 
              offer={featuredOffers[0]} 
              featured={true} 
              className="mb-5"
            />
          )
        )}
        
        <div className="grid grid-cols-1 gap-4">
          {offersLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
                <div className="flex gap-3">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 rounded-full mb-2" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            offers?.filter(offer => !offer.featured).slice(0, 4).map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
