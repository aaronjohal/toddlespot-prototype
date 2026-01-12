import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  MapPin,
  Phone,
  Globe,
  Share2,
  Heart,
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RatingDisplay } from "@/components/ui/rating-display";
import { useToast } from "@/hooks/use-toast";
import { mockVenues } from "@/lib/mock-data";
import {
  Baby,
  Accessibility,
  Volume2,
  User,
  Coffee,
  Milk
} from "lucide-react";

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const venueId = parseInt(id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get venue from mock data
  const venue = mockVenues.find(v => v.id === venueId);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "This venue has been removed from your favorites."
        : "This venue has been added to your favorites.",
    });
  };

  // Format operating hours
  const formatHours = (hoursJson: string) => {
    try {
      const hours = JSON.parse(hoursJson);

      return (
        <div>
          {Object.keys(hours).map((key, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{key.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' - ')}</span>
              <span className="font-medium">{hours[key]}</span>
            </div>
          ))}
          <div className="mt-2 text-teal-500 text-sm">
            <span className="font-medium"><Clock className="inline mr-1 h-4 w-4" />Open Now</span>
          </div>
        </div>
      );
    } catch (e) {
      return <div className="text-sm text-gray-500">Hours information unavailable</div>;
    }
  };

  // Navigate to next/previous image
  const handleImageNavigation = (direction: 'next' | 'prev') => {
    if (!venue?.photos || venue.photos.length <= 1) return;

    if (direction === 'next') {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === venue.photos!.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? venue.photos!.length - 1 : prevIndex - 1
      );
    }
  };

  // Get feature icon
  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'changingFacilities':
        return <Baby className="mr-2 text-teal-500 h-5 w-5" />;
      case 'pramAccess':
        return <Accessibility className="mr-2 text-teal-500 h-5 w-5" />;
      case 'quietSpace':
        return <Volume2 className="mr-2 text-teal-500 h-5 w-5" />;
      case 'highChairs':
        return <User className="mr-2 text-teal-500 h-5 w-5" />;
      case 'bottleWarming':
        return <Coffee className="mr-2 text-teal-500 h-5 w-5" />;
      case 'breastfeedingArea':
        return <Milk className="mr-2 text-teal-500 h-5 w-5" />;
      default:
        return null;
    }
  };

  // Get feature label
  const getFeatureLabel = (feature: string) => {
    switch (feature) {
      case 'changingFacilities':
        return 'Changing Station';
      case 'pramAccess':
        return 'Pram Access';
      case 'quietSpace':
        return 'Quiet Space';
      case 'highChairs':
        return 'High Chairs';
      case 'bottleWarming':
        return 'Bottle Warming';
      case 'breastfeedingArea':
        return 'Breastfeeding Area';
      default:
        return feature;
    }
  };

  // Get venue features
  const getVenueFeatures = () => {
    if (!venue) return [];

    const features = [];

    if (venue.changingFacilities) features.push('changingFacilities');
    if (venue.pramAccess) features.push('pramAccess');
    if (venue.quietSpace) features.push('quietSpace');
    if (venue.highChairs) features.push('highChairs');
    if (venue.bottleWarming) features.push('bottleWarming');
    if (venue.breastfeedingArea) features.push('breastfeedingArea');

    return features;
  };

  // Share venue
  const shareVenue = () => {
    if (navigator.share) {
      navigator.share({
        title: venue?.name || 'Baby-friendly venue on toddleSpot',
        text: `Check out ${venue?.name} on toddleSpot!`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied",
          description: "Venue link copied to clipboard",
        });
      });
    }
  };

  if (!venue) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800">Venue not found</h2>
        <Button
          className="mt-4 bg-teal-500 hover:bg-teal-600"
          onClick={() => navigate("/")}
        >
          Go back to discover
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Venue images carousel */}
      <div className="relative h-64 bg-gray-200">
        {venue.photos && venue.photos.length > 0 ? (
          <img
            src={venue.photos[currentImageIndex]}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No images available
          </div>
        )}

        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:bg-gray-100"
            onClick={() => navigate("/")}
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:bg-gray-100"
            onClick={shareVenue}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "text-rose-500 fill-rose-500" : "text-gray-700"
              }`}
            />
          </Button>
        </div>

        {venue.photos && venue.photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
              onClick={() => handleImageNavigation('prev')}
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md"
              onClick={() => handleImageNavigation('next')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-4 right-4 z-10">
              <span className="bg-white/80 rounded-full px-3 py-1 text-xs font-medium">
                {currentImageIndex + 1}/{venue.photos.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Venue details */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 p-4">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-xl font-bold text-gray-800">{venue.name}</h1>
          <div className="flex items-center bg-teal-500 text-white rounded px-2 py-1">
            <span className="font-medium">{venue.overallRating?.toFixed(1) || 'N/A'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-1">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <p className="text-gray-600 mb-3">
          {venue.type} • {venue.reviewCount} {venue.reviewCount === 1 ? 'review' : 'reviews'}
        </p>

        {/* Quick actions */}
        <div className="flex gap-3 mb-5">
          <Button
            variant="outline"
            className="flex-1 flex flex-col items-center justify-center bg-gray-100 rounded-xl py-3 h-auto hover:bg-gray-200"
            asChild
          >
            <a href={`https://maps.google.com/?q=${venue.latitude},${venue.longitude}`} target="_blank" rel="noopener noreferrer">
              <MapPin className="h-5 w-5 text-teal-500 mb-1" />
              <span className="text-xs text-gray-700">Directions</span>
            </a>
          </Button>

          {venue.phone && (
            <Button
              variant="outline"
              className="flex-1 flex flex-col items-center justify-center bg-gray-100 rounded-xl py-3 h-auto hover:bg-gray-200"
              asChild
            >
              <a href={`tel:${venue.phone}`}>
                <Phone className="h-5 w-5 text-teal-500 mb-1" />
                <span className="text-xs text-gray-700">Call</span>
              </a>
            </Button>
          )}

          {venue.website && (
            <Button
              variant="outline"
              className="flex-1 flex flex-col items-center justify-center bg-gray-100 rounded-xl py-3 h-auto hover:bg-gray-200"
              asChild
            >
              <a href={venue.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-5 w-5 text-teal-500 mb-1" />
                <span className="text-xs text-gray-700">Website</span>
              </a>
            </Button>
          )}
        </div>

        {/* Hours */}
        {venue.hours && (
          <div className="mb-5">
            <h2 className="text-lg font-semibold mb-2">Hours</h2>
            {formatHours(venue.hours)}
          </div>
        )}

        {/* Baby-friendliness ratings */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold mb-3">Baby-Friendliness</h2>

          <div className="space-y-3">
            {venue.changingFacilitiesRating && (
              <RatingDisplay label="Changing Facilities" rating={venue.changingFacilitiesRating} />
            )}

            {venue.highChairsRating && (
              <RatingDisplay label="High Chairs" rating={venue.highChairsRating} />
            )}

            {venue.pramAccessRating && (
              <RatingDisplay label="Pram Access" rating={venue.pramAccessRating} />
            )}

            {venue.staffFriendlinessRating && (
              <RatingDisplay label="Staff Friendliness" rating={venue.staffFriendlinessRating} />
            )}

            {venue.noiseLevelRating && (
              <RatingDisplay label="Noise Level" rating={venue.noiseLevelRating} />
            )}
          </div>
        </div>

        {/* Key features */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold mb-3">Key Features</h2>

          <div className="grid grid-cols-2 gap-3">
            {getVenueFeatures().map((feature, index) => (
              <div key={index} className="flex items-center p-3 bg-teal-500 bg-opacity-10 rounded-lg">
                {getFeatureIcon(feature)}
                <span className="text-sm font-medium">{getFeatureLabel(feature)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Reviews</h2>
            <Button variant="ghost" className="text-teal-500 font-medium text-sm p-0 h-auto">
              Write a Review
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
