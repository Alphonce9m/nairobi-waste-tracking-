import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation,
  CheckCircle,
  XCircle,
  DollarSign,
  Star,
  ToggleLeft,
  ToggleRight,
  Package,
  Timer,
  AlertCircle
} from "lucide-react";
import { wasteBoltService } from "@/services/wasteBoltService";
import { WasteRequest, Collection, WasteCollector } from "@/types/boltWaste";

const CollectorDashboard = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [availableRequests, setAvailableRequests] = useState<WasteRequest[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [collectorProfile, setCollectorProfile] = useState<WasteCollector | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock collector profile (in real app, this would come from database)
  const mockCollectorProfile: WasteCollector = {
    id: user?.id || 'collector-1',
    name: 'John Kamau',
    phone: '+254 712 345 678',
    email: 'john@wastebolt.co.ke',
    vehicle: {
      type: 'truck',
      capacity: 500, // kg
      registrationNumber: 'KBC 123A',
      photos: [],
    },
    location: {
      coordinates: { lat: -1.2921, lng: 36.8219 },
      lastUpdated: new Date().toISOString(),
    },
    availability: {
      isOnline: false,
      currentStatus: 'offline',
    },
    specializations: ['plastic', 'organic', 'mixed'],
    ratings: {
      average: 4.7,
      totalRatings: 23,
      categories: {
        punctuality: 4.8,
        professionalism: 4.6,
        wasteHandling: 4.7,
        environmentalCompliance: 4.8,
      },
    },
    earnings: {
      today: 2450,
      thisWeek: 12400,
      thisMonth: 48900,
      totalEarnings: 489000,
    },
    verification: {
      isVerified: true,
      documents: [],
      verifiedAt: '2024-01-15',
    },
  };

  useEffect(() => {
    setCollectorProfile(mockCollectorProfile);
    fetchAvailableRequests();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      fetchAvailableRequests();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAvailableRequests = async () => {
    try {
      // In a real app, this would fetch from database
      const mockRequests: WasteRequest[] = [
        {
          id: 'req-1',
          userId: 'user-1',
          wasteType: 'plastic',
          quantity: 25,
          urgency: 'normal',
          location: {
            address: 'Kilimani, Nairobi',
            coordinates: { lat: -1.2921, lng: 36.8219 },
          },
          timeWindow: {
            requestedAt: new Date().toISOString(),
            preferredTime: 'asap',
          },
          priceEstimate: {
            basePrice: 500,
            surgeMultiplier: 1,
            finalPrice: 500,
            currency: 'KES',
          },
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'req-2',
          userId: 'user-2',
          wasteType: 'organic',
          quantity: 40,
          urgency: 'urgent',
          location: {
            address: 'Westlands, Nairobi',
            coordinates: { lat: -1.2655, lng: 36.8105 },
          },
          timeWindow: {
            requestedAt: new Date().toISOString(),
            preferredTime: 'asap',
          },
          priceEstimate: {
            basePrice: 600,
            surgeMultiplier: 1.5,
            finalPrice: 900,
            currency: 'KES',
          },
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ];

      // Filter requests based on collector's specializations and availability
      const filteredRequests = mockRequests.filter(request => 
        mockCollectorProfile.specializations.includes(request.wasteType) &&
        request.status === 'pending'
      );

      setAvailableRequests(filteredRequests);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    if (!isOnline) {
      // Going online - check if all requirements are met
      if (!collectorProfile?.verification.isVerified) {
        toast({
          title: "Verification Required",
          description: "Please complete verification to go online",
          variant: "destructive",
        });
        return;
      }
    }

    const newStatus = !isOnline;
    setIsOnline(newStatus);

    // Update collector status in database
    try {
      await wasteBoltService.updateCollectorLocation(mockCollectorProfile.id, mockCollectorProfile.location.coordinates);
      
      toast({
        title: newStatus ? "You're Online!" : "You're Offline",
        description: newStatus ? "You can now receive collection requests" : "You won't receive new requests",
      });
    } catch (error) {
      toast({
        title: "Status Update Failed",
        description: "Unable to update your status",
        variant: "destructive",
      });
    }
  };

  const acceptRequest = async (requestId: string) => {
    setLoading(true);
    try {
      const collection = await wasteBoltService.acceptCollection(requestId, mockCollectorProfile.id);
      setActiveCollection(collection);
      
      // Remove from available requests
      setAvailableRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Request Accepted!",
        description: "Navigate to the pickup location",
      });
    } catch (error: unknown) {
      const errorData = error as { message: string };
      toast({
        title: "Acceptance Failed",
        description: errorData.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCollectionStatus = async (status: Collection['status']) => {
    if (!activeCollection) return;

    try {
      await wasteBoltService.updateCollectionStatus(activeCollection.id, status);
      
      if (status === 'completed') {
        setActiveCollection(null);
        toast({
          title: "Collection Completed!",
          description: "Payment processed successfully",
        });
      } else {
        setActiveCollection(prev => prev ? { ...prev, status } : null);
      }
    } catch (error: unknown) {
      const errorData = error as { message: string };
      toast({
        title: "Status Update Failed",
        description: errorData.message,
        variant: "destructive",
      });
    }
  };

  const getWasteTypeIcon = (type: string) => {
    const icons = {
      plastic: '♻️',
      organic: '🥬',
      hazardous: '☢️',
      electronic: '📱',
      mixed: '🗑️',
    };
    return icons[type as keyof typeof icons] || '🗑️';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      normal: 'bg-green-100 text-green-800',
      urgent: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800',
    };
    return colors[urgency as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      en_route: 'bg-purple-100 text-purple-800',
      arrived: 'bg-indigo-100 text-indigo-800',
      collecting: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">Collector Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Manage waste collection requests
        </p>
      </header>

      {/* Status Toggle */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Online Status</h3>
            <p className="text-sm text-muted-foreground">
              {isOnline ? "You're receiving requests" : "You're offline"}
            </p>
          </div>
          <Button
            variant={isOnline ? "default" : "outline"}
            onClick={toggleOnlineStatus}
            className="flex items-center gap-2"
          >
            {isOnline ? (
              <>
                <ToggleRight className="h-5 w-5" />
                Online
              </>
            ) : (
              <>
                <ToggleLeft className="h-5 w-5" />
                Offline
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Earnings Summary */}
      {collectorProfile && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Today's Earnings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                KES {collectorProfile.earnings.today}
              </div>
              <div className="text-sm text-muted-foreground">Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                KES {collectorProfile.earnings.thisWeek}
              </div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                KES {collectorProfile.earnings.thisMonth}
              </div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="text-2xl font-bold">{collectorProfile.ratings.average}</span>
              </div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>
        </Card>
      )}

      {/* Active Collection */}
      {activeCollection && (
        <Card className="p-6 mb-6 border-2 border-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Collection</h3>
            <Badge className={getStatusColor(activeCollection.status)}>
              {activeCollection.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Pickup location: Kilimani, Nairobi</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>25 kg plastic waste</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Earnings: KES 425</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {activeCollection.status === 'assigned' && (
              <Button onClick={() => updateCollectionStatus('en_route')}>
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            )}
            {activeCollection.status === 'en_route' && (
              <Button onClick={() => updateCollectionStatus('arrived')}>
                <MapPin className="h-4 w-4 mr-2" />
                I've Arrived
              </Button>
            )}
            {activeCollection.status === 'arrived' && (
              <Button onClick={() => updateCollectionStatus('collecting')}>
                <Package className="h-4 w-4 mr-2" />
                Start Collection
              </Button>
            )}
            {activeCollection.status === 'collecting' && (
              <Button onClick={() => updateCollectionStatus('completed')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Collection
              </Button>
            )}
            <Button variant="outline" onClick={() => updateCollectionStatus('cancelled')}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Available Requests */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Available Requests</h3>
          <Badge variant="outline">
            {availableRequests.length} requests
          </Badge>
        </div>

        {!isOnline ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Go Online to Receive Requests</h3>
            <p className="text-muted-foreground">Toggle your online status to start receiving collection requests</p>
          </div>
        ) : availableRequests.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Available Requests</h3>
            <p className="text-muted-foreground">New requests will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getWasteTypeIcon(request.wasteType)}</span>
                      <span className="font-medium">{request.quantity} kg {request.wasteType}</span>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{request.location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Requested {new Date(request.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      KES {request.priceEstimate.finalPrice}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Earn: KES {Math.round(request.priceEstimate.finalPrice * 0.85)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => acceptRequest(request.id)}
                    disabled={loading || !!activeCollection}
                  >
                    Accept Request
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CollectorDashboard;
