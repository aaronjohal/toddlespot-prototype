import React, { useState, useMemo } from "react";
import { FilterPill } from "@/components/ui/filter-pill";
import { OfferCard } from "@/components/offer-card";
import { mockOffers } from "@/lib/mock-data";

export default function OffersPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Use mock data with filtering
  const offers = useMemo(() => {
    if (activeFilter) {
      return mockOffers.filter(o => o.type === activeFilter);
    }
    return mockOffers;
  }, [activeFilter]);

  const featuredOffers = mockOffers.filter(o => o.featured);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  // Filter types
  const offerTypes = ["class", "activity", "meal"];

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
              label={type.charAt(0).toUpperCase() + type.slice(1) + (type === "class" ? "es" : "s")}
              isActive={activeFilter === type}
              onClick={() => handleFilterChange(type)}
            />
          ))}
        </div>
      </div>

      {/* Featured offers */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Featured Offers</h2>
        </div>

        {featuredOffers.length > 0 && (
          <OfferCard
            offer={featuredOffers[0]}
            featured={true}
            className="mb-5"
          />
        )}

        <div className="grid grid-cols-1 gap-4">
          {offers.filter(offer => !offer.featured).map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
