import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  HelpCircle, 
  Info, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { useLocation } from "wouter";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/auth");
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
    return 'User';
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-16 h-16 border-2 border-teal-500">
          <AvatarImage src="https://api.dicebear.com/6.x/notionists/svg" alt="Profile" />
          <AvatarFallback>{getInitials(getDisplayName())}</AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800">{getDisplayName()}</h2>
          <p className="text-gray-600">{user?.childAges?.length ? `Parent of ${user.childAges[0]}-month-old` : 'Parent'}</p>
        </div>
      </div>
      
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-800 mb-3">Your Information</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <p className="text-sm font-medium">{user?.email || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="text-xs text-gray-500">Location</label>
              <p className="text-sm font-medium">{user?.location || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="text-xs text-gray-500">Child Age</label>
              <p className="text-sm font-medium">{user?.childAges?.length ? `${user.childAges[0]} months` : 'Not provided'}</p>
            </div>
          </div>
          
          <Button variant="ghost" className="mt-4 text-teal-500 p-0">Edit Profile</Button>
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-800 mb-3">Your Activity</h3>
          
          <div className="flex justify-between mb-3">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-xs text-gray-500">Favorites</p>
            </div>
            
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">0</p>
              <p className="text-xs text-gray-500">Saved Offers</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-3">
        <Button variant="outline" className="w-full flex items-center justify-between bg-white rounded-xl p-4 h-auto">
          <div className="flex items-center">
            <Settings className="h-5 w-5 text-gray-600 mr-3" />
            <span className="font-medium">Settings</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
        
        <Button variant="outline" className="w-full flex items-center justify-between bg-white rounded-xl p-4 h-auto">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-gray-600 mr-3" />
            <span className="font-medium">Help & Support</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
        
        <Button variant="outline" className="w-full flex items-center justify-between bg-white rounded-xl p-4 h-auto">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-gray-600 mr-3" />
            <span className="font-medium">About toddleSpot</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between text-rose-500 bg-white rounded-xl p-4 h-auto"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <div className="flex items-center">
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">
              {logoutMutation.isPending ? "Logging out..." : "Log Out"}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}
