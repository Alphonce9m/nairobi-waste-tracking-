import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BottomNavSimple from "@/components/BottomNavSimple";
import Home from "@/pages/Home";
import ServiceRequest from "@/pages/ServiceRequest";
import MarketplaceFixed from "@/pages/MarketplaceFixed";
import Dashboard from "@/pages/Dashboard";
import Community from "@/pages/Community";
import AuthWorking from "@/pages/AuthWorking";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import RequestCollection from "./pages/RequestCollection";
import CollectorDashboard from "./pages/CollectorDashboard";
import SmartCollectorDashboard from "./pages/SmartCollectorDashboard";
import Learn from "./pages/Learn";
import TestSupabase from "./pages/TestSupabase";
import TrackCollection from "./pages/TrackCollection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Temporarily disable SupabaseProvider to fix the crash */}
    {/* <SupabaseProvider> */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/service-request" element={<ServiceRequest />} />
              <Route path="/track-requests" element={<Dashboard />} />
              <Route path="/marketplace" element={<MarketplaceFixed />} />
              <Route path="/community" element={<Community />} />
              <Route path="/auth" element={<AuthWorking />} />
              <Route path="/request-collection" element={<RequestCollection />} />
              <Route path="/collector-dashboard" element={<CollectorDashboard />} />
              <Route path="/smart-collector-dashboard" element={<SmartCollectorDashboard />} />
              <Route path="/track-collection" element={<TrackCollection />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/test-supabase" element={<TestSupabase />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavSimple />
          </div>
        </Router>
      </TooltipProvider>
    {/* </SupabaseProvider> */}
  </QueryClientProvider>
);

export default App;
