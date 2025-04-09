import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { FilterPill } from "@/components/ui/filter-pill";
import { Skeleton } from "@/components/ui/skeleton";
import { VenueCard } from "@/components/venue-card";
import { Venue } from "@shared/schema";
import { Filter, PlusCircle } from "lucide-react";

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
  
  // Fetch venues
  const { data: venues, isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues", activeFilter],
    queryFn: async () => {
      const url = activeFilter
        ? `/api/venues?type=${encodeURIComponent(activeFilter)}`
        : "/api/venues";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch venues");
      return res.json();
    }
  });
  
  // Fetch nearby venues if we have location
  const { data: nearbyVenues, isLoading: nearbyLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues/nearby", userLocation],
    queryFn: async () => {
      if (!userLocation) return [];
      const url = `/api/venues/nearby?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch nearby venues");
      return res.json();
    },
    enabled: !!userLocation
  });
  
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
          {venuesLoading ? (
            // Loading skeletons
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="h-40 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="flex gap-1.5">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            venues?.slice(0, 2).map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                distance={calculateDistance(venue)}
                onClick={() => handleVenueClick(venue.id)}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Nearby spots */}
      {userLocation && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Nearby Spots</h2>
            <a href="#" className="text-sm text-teal-500 font-medium">See all</a>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {nearbyLoading ? (
              // Loading skeletons
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <div className="flex gap-1.5">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              nearbyVenues?.slice(0, 3).map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  distance={calculateDistance(venue)}
                  onClick={() => handleVenueClick(venue.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Floating action button */}
      <div className="fixed right-4 bottom-24 z-50">
        <button className="bg-rose-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
          <PlusCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
