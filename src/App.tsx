import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BottomNavSimple from "@/components/BottomNavSimple";
import Home from "@/pages/Home";
import ServiceRequest from "@/pages/ServiceRequest";
import MarketplaceRouter from "@/pages/MarketplaceRouter";
import Dashboard from "@/pages/Dashboard";
import Community from "@/pages/Community";
import AuthSupabase from "@/pages/AuthSupabase";
import { SupabaseProvider, useSupabase } from "@/contexts/SupabaseContext";
import RequestCollection from "./pages/RequestCollection";
import CollectorDashboard from "./pages/CollectorDashboard";
import SmartCollectorDashboard from "./pages/SmartCollectorDashboard";
import Learn from "./pages/Learn";
import TestSupabase from "./pages/TestSupabase";
import TrackCollection from "./pages/TrackCollection";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useSupabase();

  console.log("ProtectedRoute: rendering", { loading, user: !!user, userEmail: user?.email });

  if (loading) {
    console.log("ProtectedRoute: still loading, returning null");
    return null;
  }

  if (!user) {
    console.log("ProtectedRoute: no user, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("ProtectedRoute: user exists, rendering children");
  return children;
};

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useSupabase();

  console.log("GuestRoute: rendering", { loading, user: !!user, userEmail: user?.email });

  if (loading) {
    console.log("GuestRoute: still loading, returning null");
    return null;
  }

  if (user) {
    console.log("GuestRoute: user exists, redirecting to /marketplace");
    return <Navigate to="/marketplace" replace />;
  }

  console.log("GuestRoute: no user, rendering children");
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <ErrorBoundary>
            <div className="min-h-screen bg-background">
            <Routes>
              <Route
                path="/"
                element={
                  <GuestRoute>
                    <AuthSupabase />
                  </GuestRoute>
                }
              />
              <Route
                path="/auth"
                element={
                  <GuestRoute>
                    <AuthSupabase />
                  </GuestRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/service-request"
                element={
                  <ProtectedRoute>
                    <ServiceRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/track-requests"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <MarketplaceRouter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/request-collection"
                element={
                  <ProtectedRoute>
                    <RequestCollection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collector-dashboard"
                element={
                  <ProtectedRoute>
                    <CollectorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/smart-collector-dashboard"
                element={
                  <ProtectedRoute>
                    <SmartCollectorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/track-collection"
                element={
                  <ProtectedRoute>
                    <TrackCollection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn"
                element={
                  <ProtectedRoute>
                    <Learn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test-supabase"
                element={
                  <ProtectedRoute>
                    <TestSupabase />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>404 - Page Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
            </Routes>
            <BottomNavSimple />
          </div>
          </ErrorBoundary>
        </Router>
      </TooltipProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
