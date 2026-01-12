import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { FilterPill } from "@/components/ui/filter-pill";
import { VenueCard } from "@/components/venue-card";
import { Filter, PlusCircle } from "lucide-react";
import { mockVenues } from "@/lib/mock-data";

export default function DiscoverPage() {
  const [, navigate] = useLocation();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Use mock data with filtering
  const venues = useMemo(() => {
    if (activeFilter) {
      return mockVenues.filter(v => v.type === activeFilter);
    }
    return mockVenues;
  }, [activeFilter]);

  const nearbyVenues = mockVenues;
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };
  
  const handleVenueClick = (id: number) => {
    navigate(`/venues/${id}`);
  };
  
  // Calculate rough distance from user
  const calculateDistance = (venue: Venue) => {
    if (!userLocation) return null;
    
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(venue.latitude - userLocation.latitude);
    const dLon = deg2rad(venue.longitude - userLocation.longitude);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(userLocation.latitude)) * Math.cos(deg2rad(venue.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    
    return formatDistance(distance);
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };
  
  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };
  
  // Filter types
  const venueTypes = ["Café", "Restaurant", "Play Area", "Park"];
  
  return (
    <div className="p-4">
      {/* Filter bar */}
      <div className="mb-4 overflow-x-auto whitespace-nowrap py-1 -mx-4 px-4">
        <div className="inline-flex gap-2">
          <FilterPill
            label="Filters"
            icon={<Filter className="h-4 w-4" />}
            isActive={false}
          />
          
          {venueTypes.map((type) => (
            <FilterPill
              key={type}
              label={type}
              isActive={activeFilter === type}
              onClick={() => handleFilterChange(type)}
            />
          ))}
        </div>
      </div>
      
      {/* Top Baby-Friendly spots */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Top Baby-Friendly Spots</h2>
          <a href="#" className="text-sm text-teal-500 font-medium">See all</a>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {venues.slice(0, 2).map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              distance={calculateDistance(venue)}
              onClick={() => handleVenueClick(venue.id)}
            />
          ))}
        </div>
      </div>

      {/* Nearby spots */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Nearby Spots</h2>
          <a href="#" className="text-sm text-teal-500 font-medium">See all</a>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {nearbyVenues.slice(0, 3).map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              distance={calculateDistance(venue)}
              onClick={() => handleVenueClick(venue.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Floating action button */}
      <div className="fixed right-4 bottom-24 z-50">
        <button className="bg-rose-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
          <PlusCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
