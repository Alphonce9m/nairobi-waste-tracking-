import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import Home from "@/pages/Home";
import MarketplaceRouter from "@/pages/MarketplaceRouter";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import { SupabaseProvider, useSupabase } from "@/contexts/SupabaseContext";
import { UserProvider } from "@/contexts/UserContext";
import CollectorDashboard from "./pages/CollectorDashboard";
import SmartCollectorDashboard from "./pages/SmartCollectorDashboard";
import Learn from "./pages/Learn";
import TestSupabase from "./pages/TestSupabase";
import TrackCollection from "./pages/TrackCollection";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import TestPage from "./pages/TestPage";
import Analyze from "./pages/Analyze";
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
      <UserProvider>
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
                    <Auth />
                  </GuestRoute>
                }
              />
              <Route
                path="/auth"
                element={
                  <GuestRoute>
                    <Auth />
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
              <Route
                path="/test-page"
                element={
                  <ProtectedRoute>
                    <TestPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analyze"
                element={
                  <ProtectedRoute>
                    <Analyze />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <GuestRoute>
                    <ResetPassword />
                  </GuestRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test"
                element={<TestPage />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>404 - Page Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
            </Routes>
            <BottomNav />
          </div>
          </ErrorBoundary>
          </Router>
        </TooltipProvider>
      </UserProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
