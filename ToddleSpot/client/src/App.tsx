import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DiscoverPage from "@/pages/discover-page";
import MapPage from "@/pages/map-page";
import OffersPage from "@/pages/offers-page";
import FavoritesPage from "@/pages/favorites-page";
import ProfilePage from "@/pages/profile-page";
import VenueDetailPage from "@/pages/venue-detail-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import Onboarding from "./components/onboarding";
import { useState, useEffect } from "react";
import Header from "./components/header";
import BottomNavigation from "./components/bottom-navigation";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DiscoverPage} />
      <ProtectedRoute path="/map" component={MapPage} />
      <ProtectedRoute path="/offers" component={OffersPage} />
      <ProtectedRoute path="/favorites" component={FavoritesPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/venues/:id" component={VenueDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check if the user has visited before
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setShowOnboarding(true);
    }
  }, []);
  
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasVisitedBefore', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {showOnboarding ? (
            <Onboarding onClose={handleCloseOnboarding} />
          ) : (
            <>
              <Header />
              <main className="flex-1 pb-20">
                <Router />
              </main>
              <BottomNavigation />
            </>
          )}
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
