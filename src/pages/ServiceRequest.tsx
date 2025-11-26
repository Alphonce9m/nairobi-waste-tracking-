import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { 
  MapPin, 
  Clock, 
  Scale, 
  DollarSign, 
  Truck, 
  CheckCircle,
  AlertCircle,
  Phone,
  Navigation,
  Star,
  Users
} from "lucide-react";
// import { realtimeService } from "@/services/realtimeService";
import { whatsappService } from "@/services/whatsappService";

interface ServiceRequest {
  id: string;
  clientId: string;
  wasteType: 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed';
  quantity: number;
  location: string;
  coordinates?: { lat: number; lng: number };
  urgency: 'normal' | 'urgent' | 'emergency';
  description?: string;
  estimatedPrice: number;
  status: 'pending' | 'matched' | 'accepted' | 'en_route' | 'collecting' | 'completed' | 'cancelled';
  createdAt: string;
  matchedCollectorId?: string;
  matchedCollectorName?: string;
  collectorPhone?: string;
  collectorRating?: number;
  eta?: string;
  estimatedTime?: number;
}

const ServiceRequest = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    location: '',
    urgency: 'normal',
    description: '',
    customerName: '',
    customerPhone: '',
  });

  // Waste type pricing (KES per kg)
  const wastePricing = {
    plastic: 25,
    organic: 15,
    electronic: 50,
    hazardous: 100,
    mixed: 20,
  };

  // Urgency multipliers
  const urgencyMultipliers = {
    normal: 1,
    urgent: 1.5,
    emergency: 2,
  };

  useEffect(() => {
    // TODO: Re-enable real-time updates when realtimeService is fixed
    // const unsubscribe = realtimeService.subscribeToServiceRequests((request) => {
    //   if (request.clientId === user?.id) {
    //     setActiveRequests(prev => {
    //       const existingIndex = prev.findIndex(r => r.id === request.id);
    //       if (existingIndex >= 0) {
    //         const updated = [...prev];
    //         updated[existingIndex] = request;
    //         return updated;
    //       }
    //       return [...prev, request];
    //     });
    //     
    //     // Show notification for status changes
    //     if (request.status === 'matched') {
    //       toast({
    //         title: "Collector Found!",
    //         description: `${request.matchedCollectorName} has been matched to your request.`,
    //       });
    //     } else if (request.status === 'accepted') {
    //       toast({
    //         title: "Request Accepted!",
    //         description: `${request.matchedCollectorName} is on the way. ETA: ${request.eta}`,
    //       });
    //     } else if (request.status === 'en_route') {
    //       toast({
    //         title: "Collector En Route",
    //         description: `${request.matchedCollectorName} is heading to your location.`,
    //       });
    //     } else if (request.status === 'collecting') {
    //       toast({
    //         title: "Collection Started",
    //         description: "The collector has arrived and started collecting your waste.",
    //       });
    //     } else if (request.status === 'completed') {
    //       toast({
    //         title: "Collection Completed!",
    //         description: "Your waste has been successfully collected.",
    //       });
    //     }
    //   }
    // });

    // return () => {
    //   unsubscribe();
    // };
  }, [user, toast]);

  const calculatePrice = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const wasteType = formData.wasteType as keyof typeof wastePricing;
    const urgency = formData.urgency as keyof typeof urgencyMultipliers;
    
    if (!wasteType || !wastePricing[wasteType]) return 0;
    
    const basePrice = quantity * wastePricing[wasteType];
    return basePrice * urgencyMultipliers[urgency];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a service request",
        variant: "destructive",
      });
      return;
    }

    if (!formData.wasteType || !formData.quantity || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newRequest: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'> = {
        clientId: user.id,
        wasteType: formData.wasteType as ServiceRequest['wasteType'],
        quantity: parseFloat(formData.quantity),
        location: formData.location,
        urgency: formData.urgency as ServiceRequest['urgency'],
        description: formData.description,
        estimatedPrice: calculatePrice(),
      };

      // Submit request (this would normally go to your backend)
      const requestId = `req-${Date.now()}`;
      const request: ServiceRequest = {
        ...newRequest,
        id: requestId,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      // Broadcast the request to backend for collector matching
      // await realtimeService.broadcastRequestUpdate(request);

      setActiveRequests(prev => [...prev, request]);
      
      // Send WhatsApp confirmation to customer
      if (formData.customerPhone) {
        whatsappService.sendOrderConfirmation({
          id: requestId,
          wasteType: formData.wasteType,
          quantity: parseFloat(formData.quantity),
          location: formData.location,
          urgency: formData.urgency,
          estimatedPrice: request.estimatedPrice,
          description: formData.description,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
        });
      }
      
      toast({
        title: "Request Submitted Successfully!",
        description: `Your waste collection request has been sent. We're finding the best collector for you. Estimated price: KES ${request.estimatedPrice}${formData.customerPhone ? ' - WhatsApp confirmation sent!' : ''}`,
      });

      // Reset form
      setFormData({
        wasteType: '',
        quantity: '',
        location: '',
        urgency: 'normal',
        description: '',
        customerName: '',
        customerPhone: '',
      });

    } catch (error: unknown) {
      const errorData = error as { message: string };
      toast({
        title: "Submission Failed",
        description: errorData.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'matched': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'en_route': return 'bg-purple-100 text-purple-800';
      case 'collecting': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'matched': return <Users className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'en_route': return <Navigation className="h-4 w-4" />;
      case 'collecting': return <Truck className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Request Waste Collection</h1>
            <p className="text-muted-foreground text-lg">
              Get your waste collected by verified collectors in your area
            </p>
          </div>
          <Badge className={connectionStatus === 'connected' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {connectionStatus === 'connected' ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Offline
              </>
            )}
          </Badge>
        </div>
      </header>

      {/* Active Requests */}
      {activeRequests.length > 0 && (
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue/10 to-blue/5 border-blue/20">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">Your Active Requests</h2>
            <Badge variant="secondary">{activeRequests.length} Active</Badge>
          </div>
          
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <Card key={request.id} className={`p-4 border-l-4 ${
                request.status === 'completed' ? 'border-gray-300' : 
                request.status === 'cancelled' ? 'border-red-300' :
                request.status === 'matched' || request.status === 'accepted' ? 'border-green-500 animate-pulse' : 
                'border-blue-500'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(request.status)}
                      <h4 className="font-semibold capitalize">{request.wasteType} Collection</h4>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{request.quantity} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{request.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Price</p>
                        <p className="font-medium text-primary">KES {request.estimatedPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Requested</p>
                        <p className="font-medium">{new Date(request.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    {request.description && (
                      <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                    )}

                    {/* Collector Information */}
                    {request.matchedCollectorName && (
                      <div className="bg-green/10 rounded-lg p-3 mb-3">
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          Matched Collector
                        </h5>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{request.matchedCollectorName}</p>
                          </div>
                          {request.collectorPhone && (
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p className="font-medium">{request.collectorPhone}</p>
                            </div>
                          )}
                          {request.collectorRating && (
                            <div>
                              <p className="text-sm text-muted-foreground">Rating</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-medium">{request.collectorRating}</span>
                              </div>
                            </div>
                          )}
                          {request.eta && (
                            <div>
                              <p className="text-sm text-muted-foreground">ETA</p>
                              <p className="font-medium">{request.eta}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="destructive">
                      Cancel Request
                    </Button>
                  </div>
                )}

                {(request.status === 'accepted' || request.status === 'en_route') && request.collectorPhone && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Collector
                    </Button>
                    <Button size="sm" variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Track Location
                    </Button>
                  </div>
                )}

                {request.status === 'completed' && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      Rate Service
                    </Button>
                    <Button size="sm" variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      Request Again
                    </Button>
                  </div>
                )}

                {request.status === 'cancelled' && (
                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      Request Again
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Request Form */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Submit Collection Request</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="wasteType">Waste Type *</Label>
              <Select value={formData.wasteType} onValueChange={(value) => setFormData({ ...formData, wasteType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plastic">Plastic (KES 25/kg)</SelectItem>
                  <SelectItem value="organic">Organic (KES 15/kg)</SelectItem>
                  <SelectItem value="electronic">Electronic (KES 50/kg)</SelectItem>
                  <SelectItem value="hazardous">Hazardous (KES 100/kg)</SelectItem>
                  <SelectItem value="mixed">Mixed (KES 20/kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity (kg) *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity in kilograms"
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter your location/address"
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (2-4 hours)</SelectItem>
                  <SelectItem value="urgent">Urgent (1 hour)</SelectItem>
                  <SelectItem value="emergency">Emergency (30 mins)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customerName">Your Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">WhatsApp Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="254723065707"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                For order confirmation and updates
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Additional Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide any additional details about your waste..."
              rows={3}
            />
          </div>

          {/* Price Estimate */}
          {formData.wasteType && formData.quantity && (
            <Card className="p-4 bg-gradient-to-br from-green/10 to-green/5 border-green/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Estimated Price:</span>
                </div>
                <span className="text-2xl font-bold text-green-600">KES {calculatePrice()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Base price: KES {(parseFloat(formData.quantity) || 0) * wastePricing[formData.wasteType as keyof typeof wastePricing]} 
                {formData.urgency !== 'normal' && ` × ${urgencyMultipliers[formData.urgency as keyof typeof urgencyMultipliers]}x urgency multiplier`}
              </p>
            </Card>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Truck className="h-4 w-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ServiceRequest;
