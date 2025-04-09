import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { RatingDisplay } from "@/components/ui/rating-display";
import { Stars } from "@/components/ui/stars";
import { ReviewCard } from "@/components/review-card";
import { FeatureBadge } from "@/components/ui/feature-badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Venue, Review, InsertReview } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fetch venue details
  const { data: venue, isLoading: venueLoading } = useQuery<Venue>({
    queryKey: [`/api/venues/${venueId}`],
    queryFn: async () => {
      const res = await fetch(`/api/venues/${venueId}`);
      if (!res.ok) throw new Error("Failed to fetch venue");
      return res.json();
    }
  });
  
  // Fetch venue reviews
  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: [`/api/venues/${venueId}/reviews`],
    queryFn: async () => {
      const res = await fetch(`/api/venues/${venueId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    }
  });
  
  // Check if venue is in favorites
  const { data: favorites } = useQuery<Venue[]>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return res.json();
    },
    onSuccess: (data) => {
      const isFav = data.some(fav => fav.id === venueId);
      setIsFavorite(isFav);
    }
  });
  
  // Add to favorites mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) return null;
      const res = await apiRequest("POST", "/api/favorites", {
        userId: user.id,
        venueId: venueId
      });
      return res.json();
    },
    onSuccess: () => {
      setIsFavorite(true);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to favorites",
        description: "This venue has been added to your favorites.",
      });
    }
  });
  
  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) return null;
      const res = await apiRequest("DELETE", `/api/favorites/${venueId}`);
      return res.json();
    },
    onSuccess: () => {
      setIsFavorite(false);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "This venue has been removed from your favorites.",
      });
    }
  });
  
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };
  
  // Format operating hours
  const formatHours = (hoursJson: string) => {
    try {
      const hours = JSON.parse(hoursJson);
      
      // Check if venue is open now
      const isOpenNow = () => {
        const now = new Date();
        const day = now.getDay();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const time = parseInt(timeStr.replace(':', ''));
        
        // Simple implementation - assuming hours are like "8:00-18:00"
        const dayKeys = Object.keys(hours);
        let isOpen = false;
        
        dayKeys.forEach(key => {
          if (key.includes('monday') && day === 1 ||
              key.includes('tuesday') && day === 2 ||
              key.includes('wednesday') && day === 3 ||
              key.includes('thursday') && day === 4 ||
              key.includes('friday') && day === 5 ||
              key.includes('saturday') && day === 6 ||
              key.includes('sunday') && day === 0) {
                
            const [start, end] = hours[key].split('-');
            const startTime = parseInt(start.replace(':', ''));
            const endTime = parseInt(end.replace(':', ''));
            
            if (time >= startTime && time <= endTime) {
              isOpen = true;
            }
          }
        });
        
        return isOpen;
      };
      
      return (
        <div>
          {Object.keys(hours).map((key, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{key.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' - ')}</span>
              <span className="font-medium">{hours[key]}</span>
            </div>
          ))}
          <div className="mt-2 text-teal-500 text-sm">
            <span className="font-medium"><Clock className="inline mr-1 h-4 w-4" />{isOpenNow() ? 'Open Now' : 'Closed'}</span>
          </div>
        </div>
      );
    } catch (e) {
      return <div className="text-sm text-gray-500">Hours information unavailable</div>;
    }
  };
  
  // Create review form schema
  const reviewSchema = z.object({
    overallRating: z.coerce.number().min(1).max(5),
    changingFacilitiesRating: z.coerce.number().min(1).max(5).optional(),
    highChairsRating: z.coerce.number().min(1).max(5).optional(),
    pramAccessRating: z.coerce.number().min(1).max(5).optional(),
    staffFriendlinessRating: z.coerce.number().min(1).max(5).optional(),
    noiseLevelRating: z.coerce.number().min(1).max(5).optional(),
    content: z.string().min(10, "Review must be at least 10 characters long"),
    childAge: z.string().optional(),
  });
  
  // Initialize review form
  const reviewForm = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 5,
      changingFacilitiesRating: 5,
      highChairsRating: 5,
      pramAccessRating: 5,
      staffFriendlinessRating: 5,
      noiseLevelRating: 5,
      content: "",
      childAge: "",
    },
  });
  
  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reviewSchema>) => {
      if (!user) return null;
      
      const review: InsertReview = {
        venueId,
        userId: user.id,
        ...data,
        visitDate: new Date(),
      };
      
      const res = await apiRequest("POST", "/api/reviews", review);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/venues/${venueId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/venues/${venueId}`] });
      setReviewDialogOpen(false);
      reviewForm.reset();
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle review form submission
  const onReviewSubmit = (data: z.infer<typeof reviewSchema>) => {
    submitReviewMutation.mutate(data);
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
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied",
          description: "Venue link copied to clipboard",
        });
      });
    }
  };

  if (venueLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200"></div>
        <div className="bg-white rounded-t-3xl -mt-6 relative z-10 p-4">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2 mb-4" />
          
          <div className="flex gap-3 mb-5">
            <Skeleton className="flex-1 h-20 rounded-xl" />
            <Skeleton className="flex-1 h-20 rounded-xl" />
            <Skeleton className="flex-1 h-20 rounded-xl" />
          </div>
          
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-5" />
          
          <Skeleton className="h-6 w-1/3 mb-2" />
          <div className="space-y-3 mb-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          <Skeleton className="h-6 w-1/3 mb-2" />
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

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
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-teal-500 font-medium text-sm p-0 h-auto">
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Write a Review for {venue.name}</DialogTitle>
                </DialogHeader>
                <Form {...reviewForm}>
                  <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-4 pt-2">
                    <FormField
                      control={reviewForm.control}
                      name="overallRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overall Rating</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              step="1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {venue.changingFacilities && (
                      <FormField
                        control={reviewForm.control}
                        name="changingFacilitiesRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Changing Facilities Rating</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                step="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {venue.highChairs && (
                      <FormField
                        control={reviewForm.control}
                        name="highChairsRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>High Chairs Rating</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                step="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {venue.pramAccess && (
                      <FormField
                        control={reviewForm.control}
                        name="pramAccessRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pram Access Rating</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="5"
                                step="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={reviewForm.control}
                      name="staffFriendlinessRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff Friendliness Rating</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              step="1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={reviewForm.control}
                      name="noiseLevelRating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Noise Level Rating</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              step="1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={reviewForm.control}
                      name="childAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Age in Months (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 8"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={reviewForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your experience with this venue..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-teal-500 hover:bg-teal-600"
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {reviewsLoading ? (
              // Loading skeletons
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-4 w-full mt-1" />
                      <Skeleton className="h-4 w-2/3 mt-1" />
                    </div>
                  </div>
                </div>
              ))
            ) : reviews && reviews.length > 0 ? (
              <>
                {reviews.slice(0, 3).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                
                {reviews.length > 3 && (
                  <Button variant="outline" className="w-full">
                    Show More Reviews
                  </Button>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
