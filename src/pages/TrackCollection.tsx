import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation,
  CheckCircle,
  Package,
  Timer,
  MessageSquare,
  Star,
  Route
} from "lucide-react";
import { Collection } from "@/types/boltWaste";

const TrackCollection = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Mock collection data (in real app, this would come from database)
  const mockCollection: Collection = {
    id: 'collection-1',
    requestId: 'req-1',
    collectorId: 'collector-1',
    status: 'en_route',
    timeline: {
      assignedAt: '2024-11-22T10:30:00Z',
      enRouteAt: '2024-11-22T10:35:00Z',
    },
    route: {
      coordinates: [
        { lat: -1.2921, lng: 36.8219 }, // Collector location
        { lat: -1.2850, lng: 36.8200 }, // Midpoint
        { lat: -1.2800, lng: 36.8150 }, // User location
      ],
      estimatedArrival: '2024-11-22T10:45:00Z',
      distance: 3.2,
    },
    payment: {
      amount: 500,
      commissionRate: 0.15,
      platformFee: 50,
      collectorEarnings: 425,
      status: 'pending',
    },
  };

  useEffect(() => {
    // Simulate loading collection data
    setTimeout(() => {
      setCollection(mockCollection);
      setLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (mockCollection.status !== 'completed') {
        // Update collector position and status
        updateCollectionProgress();
      }
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateCollectionProgress = () => {
    // Simulate collector movement
    if (mockCollection.status === 'en_route') {
      // Update ETA and distance
      const newDistance = Math.max(0.5, mockCollection.route!.distance - 0.5);
      const newETA = new Date(Date.now() + newDistance * 5 * 60 * 1000); // 5 min per km
      
      setCollection(prev => prev ? {
        ...prev,
        route: prev.route ? {
          ...prev.route,
          distance: newDistance,
          estimatedArrival: newETA.toISOString(),
        } : undefined,
      } : null);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = {
      assigned: 1,
      en_route: 2,
      arrived: 3,
      collecting: 4,
      completed: 5,
    };
    return steps[status as keyof typeof steps] || 0;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      assigned: 'bg-blue-100 text-blue-800',
      en_route: 'bg-purple-100 text-purple-800',
      arrived: 'bg-indigo-100 text-indigo-800',
      collecting: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      assigned: 'Collector Assigned',
      en_route: 'On The Way',
      arrived: 'Arrived',
      collecting: 'Collecting Waste',
      completed: 'Completed',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const calculateETA = () => {
    if (!collection?.route) return 'Calculating...';
    
    const eta = new Date(collection.route.estimatedArrival);
    const now = new Date();
    const minutes = Math.ceil((eta.getTime() - now.getTime()) / (1000 * 60));
    
    if (minutes <= 0) return 'Arriving any moment';
    if (minutes <= 5) return `${minutes} min away`;
    return `${minutes} minutes away`;
  };

  const submitRating = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, this would call the rating service
      console.log('Submitting rating:', { rating, feedback });
      
      toast({
        title: "Thank You!",
        description: "Your feedback helps us improve our service",
      });
      
      setRating(0);
      setFeedback('');
    } catch (error) {
      toast({
        title: "Rating Failed",
        description: "Unable to submit your rating",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
        <div className="text-center py-8">
          <Truck className="h-12 w-12 animate-pulse text-muted-foreground mx-auto mb-4" />
          <p>Loading collection details...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Collection</h3>
          <p className="text-muted-foreground">You don't have any active collections to track</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">Track Collection</h1>
        <p className="text-muted-foreground text-lg">
          Real-time tracking of your waste collection
        </p>
      </header>

      {/* Status Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Collection Status</h3>
            <p className="text-sm text-muted-foreground">
              Request #{collection.requestId.slice(0, 8)}
            </p>
          </div>
          <Badge className={getStatusColor(collection.status)}>
            {getStatusLabel(collection.status)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{getStatusStep(collection.status)}/5 steps</span>
          </div>
          <Progress value={(getStatusStep(collection.status) / 5) * 100} className="h-2" />
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          <div className={`flex items-center gap-3 ${getStatusStep(collection.status) >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <CheckCircle className="h-4 w-4" />
            <span>Collector Assigned</span>
            <span className="text-xs">10:30 AM</span>
          </div>
          <div className={`flex items-center gap-3 ${getStatusStep(collection.status) >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <Truck className="h-4 w-4" />
            <span>On The Way</span>
            <span className="text-xs">10:35 AM</span>
          </div>
          <div className={`flex items-center gap-3 ${getStatusStep(collection.status) >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <MapPin className="h-4 w-4" />
            <span>Arrived at Location</span>
            <span className="text-xs">--:--</span>
          </div>
          <div className={`flex items-center gap-3 ${getStatusStep(collection.status) >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
            <Package className="h-4 w-4" />
            <span>Collecting Waste</span>
            <span className="text-xs">--:--</span>
          </div>
          <div className={`flex items-center gap-3 ${getStatusStep(collection.status) >= 5 ? 'text-primary' : 'text-muted-foreground'}`}>
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
            <span className="text-xs">--:--</span>
          </div>
        </div>
      </Card>

      {/* Live Tracking */}
      {collection.status === 'en_route' && collection.route && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Live Tracking</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{calculateETA()}</div>
              <div className="text-sm text-muted-foreground">
                {collection.route.distance.toFixed(1)} km away
              </div>
            </div>
          </div>

          {/* Mock Map */}
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4">
            <div className="text-center">
              <Route className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Interactive Map View</p>
              <p className="text-xs text-muted-foreground">Collector en route to your location</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <Truck className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-sm font-medium">Collector</div>
              <div className="text-xs text-muted-foreground">John Kamau</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <Navigation className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-sm font-medium">Vehicle</div>
              <div className="text-xs text-muted-foreground">KBC 123A</div>
            </div>
          </div>
        </Card>
      )}

      {/* Collector Info */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Collector Information</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-medium">John Kamau</div>
            <div className="text-sm text-muted-foreground">Verified Collector</div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm">4.7 (23 ratings)</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-green-600">98%</div>
            <div className="text-xs text-muted-foreground">On-time Rate</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-blue-600">4.8</div>
            <div className="text-xs text-muted-foreground">Professionalism</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-purple-600">4.7</div>
            <div className="text-xs text-muted-foreground">Waste Handling</div>
          </div>
        </div>
      </Card>

      {/* Payment Details */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Collection Amount:</span>
            <span>KES {collection.payment.amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee:</span>
            <span>KES {collection.payment.platformFee}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total Paid:</span>
            <span>KES {collection.payment.amount}</span>
          </div>
        </div>
      </Card>

      {/* Rating Section */}
      {collection.status === 'completed' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
          <div className="space-y-4">
            <div>
              <Label>How was your experience?</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-2xl"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Additional Feedback (Optional)</Label>
              <textarea
                className="w-full p-3 border rounded-md mt-2"
                rows={3}
                placeholder="Tell us about your experience..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <Button onClick={submitRating} className="w-full">
              Submit Rating
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrackCollection;
