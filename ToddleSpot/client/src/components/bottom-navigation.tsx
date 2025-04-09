import React from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Compass, MapPin, Tag, Heart } from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  
  const navItems = [
    {
      name: "Discover",
      icon: Compass,
      path: "/"
    },
    {
      name: "Map",
      icon: MapPin,
      path: "/map"
    },
    {
      name: "Offers",
      icon: Tag,
      path: "/offers"
    },
    {
      name: "Favorites",
      icon: Heart,
      path: "/favorites"
    }
  ];
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.name}
            className="py-2 px-4 flex flex-col items-center"
            onClick={() => setLocation(item.path)}
          >
            <item.icon
              className={cn(
                "text-xl h-6 w-6",
                isActive(item.path) ? "text-teal-500" : "text-gray-400"
              )}
            />
            <span
              className={cn(
                "text-xs mt-1 font-medium",
                isActive(item.path) ? "text-teal-500" : "text-gray-500"
              )}
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
