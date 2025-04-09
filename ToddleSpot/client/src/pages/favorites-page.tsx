import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { VenueCard } from "@/components/venue-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Venue } from "@shared/schema";

export default function FavoritesPage() {
  const [, navigate] = useLocation();
  
  // Fetch favorite venues
  const { data: favorites, isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return res.json();
    }
  });
  
  const handleVenueClick = (id: number) => {
    navigate(`/venues/${id}`);
  };
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Favorite Places</h1>
      
      {isLoading ? (
        // Loading skeletons
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
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
      ) : favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {favorites.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              isFavorite={true}
              onClick={() => handleVenueClick(venue.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 p-5 rounded-full mb-4">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">No favorites yet</h3>
          <p className="text-gray-600 max-w-xs mt-2 mb-6">
            When you find places you love, tap the heart icon to save them here for quick access
          </p>
          <button 
            className="text-teal-500 font-medium"
            onClick={() => navigate("/")}
          >
            Discover Places to Love
          </button>
        </div>
      )}
    </div>
  );
}
