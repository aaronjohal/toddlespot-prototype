import React, { useState } from "react";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState("Nearby");
  
  const handleProfileClick = () => {
    setLocation("/profile");
  };
  
  const getHeaderTitle = () => {
    const path = location.split('/')[1];
    
    switch (path) {
      case '':
        return (
          <div className="flex items-center cursor-pointer">
            <MapPin className="text-teal-500 mr-1 h-4 w-4" />
            <span className="font-medium text-gray-800">{currentLocation}</span>
            <ChevronDown className="ml-1 text-gray-400 h-4 w-4" />
          </div>
        );
      case 'map':
        return <span className="font-medium text-gray-800">Map</span>;
      case 'offers':
        return <span className="font-medium text-gray-800">Offers</span>;
      case 'favorites':
        return <span className="font-medium text-gray-800">Favorites</span>;
      case 'profile':
        return <span className="font-medium text-gray-800">Profile</span>;
      case 'venues':
        return <span className="font-medium text-gray-800">Venue Details</span>;
      default:
        return <span className="font-medium text-gray-800">{currentLocation}</span>;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  const handleBackButton = () => {
    if (location.includes('/venues/')) {
      setLocation('/');
    }
  };
  
  const showBackButton = location.includes('/venues/');

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Current location/page title (changes based on context) */}
        <div className={cn("flex items-center", showBackButton && "cursor-pointer")} onClick={showBackButton ? handleBackButton : undefined}>
          {showBackButton && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-1 text-gray-700" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
          {getHeaderTitle()}
        </div>
        
        {/* Search and profile */}
        <div className="flex items-center gap-3">
          <button className="text-gray-500 p-1">
            <Search className="h-5 w-5" />
          </button>
          <Avatar 
            className="h-8 w-8 cursor-pointer border border-gray-300"
            onClick={handleProfileClick}
          >
            <AvatarImage src="https://api.dicebear.com/6.x/notionists/svg" alt="Profile" />
            <AvatarFallback>{user?.displayName ? getInitials(user.displayName) : 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
