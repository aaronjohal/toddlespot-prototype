import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "./logo";

interface OnboardingProps {
  onClose: () => void;
}

export default function Onboarding({ onClose }: OnboardingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between py-8 px-6">
      <div className="w-full flex justify-end">
        <Button 
          variant="ghost" 
          className="text-teal-500 font-medium"
          onClick={onClose}
        >
          Skip
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-xs text-center">
        <div className="w-64 h-64 rounded-full overflow-hidden bg-teal-50">
          <img 
            src="https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
            alt="Parent with baby in café" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <Logo size="large" />
        
        <h1 className="text-2xl font-bold text-gray-800">Find Baby-Friendly Spots</h1>
        <p className="text-gray-600">Discover cafés, restaurants, and venues rated by parents for their baby-friendliness</p>
      </div>
      
      <div className="w-full">
        <Button 
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-xl font-medium"
          onClick={onClose}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
