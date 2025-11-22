import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import Home from "@/pages/Home";
import Groups from "@/pages/Groups";
import Marketplace from "@/pages/Marketplace";
import Dashboard from "@/pages/Dashboard";
import Community from "@/pages/Community";
import Auth from "@/pages/Auth";
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
    <SupabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Groups />} />
              <Route path="/home" element={<Home />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/community" element={<Community />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/request-collection" element={<RequestCollection />} />
              <Route path="/collector-dashboard" element={<CollectorDashboard />} />
              <Route path="/smart-collector-dashboard" element={<SmartCollectorDashboard />} />
              <Route path="/track-collection" element={<TrackCollection />} />
              <Route path="/test-supabase" element={<TestSupabase />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </Router>
      </TooltipProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
