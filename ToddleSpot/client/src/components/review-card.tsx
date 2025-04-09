import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Stars } from "@/components/ui/stars";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review, User } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ReviewCardProps {
  review: Review;
  user?: User;
  className?: string;
}

export function ReviewCard({ review, user, className }: ReviewCardProps) {
  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const seconds = Math.floor((now.getTime() - reviewDate.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    if (seconds < intervals.minute) {
      return 'just now';
    }
    
    for (const [interval, secondsInInterval] of Object.entries(intervals)) {
      const count = Math.floor(seconds / secondsInInterval);
      if (count > 0) {
        return `${count} ${interval}${count !== 1 ? 's' : ''} ago`;
      }
    }
    
    return 'just now';
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.username) return user.username;
    return 'Anonymous';
  };
  
  const helpfulVoteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/reviews/${review.id}/helpful`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/venues/${review.venueId}/reviews`] });
    }
  });
  
  const handleHelpfulVote = () => {
    helpfulVoteMutation.mutate();
  };

  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 last:border-b-0 ${className || ''}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://api.dicebear.com/6.x/notionists/svg" alt={getDisplayName()} />
          <AvatarFallback>{user ? getInitials(getDisplayName()) : 'AN'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-800">{getDisplayName()}</h4>
              <p className="text-xs text-gray-500">
                {review.childAge ? `Visited with ${review.childAge}-month-old • ` : ''} 
                {formatTimeAgo(review.createdAt)}
              </p>
            </div>
            <Stars rating={review.overallRating} size={14} />
          </div>
          
          <p className="mt-2 text-sm text-gray-700">
            {review.content}
          </p>
          
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-xs text-gray-500 h-auto p-1"
              onClick={handleHelpfulVote}
              disabled={helpfulVoteMutation.isPending}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Helpful ({review.helpfulVotes})</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
