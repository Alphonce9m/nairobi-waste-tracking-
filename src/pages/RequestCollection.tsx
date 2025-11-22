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
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  Camera, 
  Calculator, 
  AlertTriangle,
  CheckCircle,
  Package,
  Timer
} from "lucide-react";
import { wasteBoltService } from "@/services/wasteBoltService";
import { WasteRequest } from "@/types/boltWaste";

const RequestCollection = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [priceEstimate, setPriceEstimate] = useState<number | null>(null);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1);
  const [nearbyCollectors, setNearbyCollectors] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    wasteType: '',
    quantity: '',
    urgency: 'normal',
    address: '',
    floor: '',
    specialInstructions: '',
    preferredTime: 'asap',
    scheduledTime: '',
    photos: [] as string[],
  });

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', icon: '♻️', basePrice: 20 },
    { value: 'organic', label: 'Organic Waste', icon: '🥬', basePrice: 15 },
    { value: 'hazardous', label: 'Hazardous', icon: '☢️', basePrice: 100 },
    { value: 'electronic', label: 'Electronic', icon: '📱', basePrice: 50 },
    { value: 'mixed', label: 'Mixed Waste', icon: '🗑️', basePrice: 25 },
  ];

  const urgencyLevels = [
    { value: 'normal', label: 'Normal (2-4 hours)', multiplier: 1 },
    { value: 'urgent', label: 'Urgent (1 hour)', multiplier: 1.5 },
    { value: 'emergency', label: 'Emergency (30 mins)', multiplier: 2.0 },
  ];

  // Calculate price estimate
  const calculatePrice = async () => {
    if (!formData.wasteType || !formData.quantity) return;

    try {
      const mockRequest = {
        userId: user?.id || '',
        wasteType: formData.wasteType as 'plastic' | 'organic' | 'hazardous' | 'electronic' | 'mixed',
        quantity: parseFloat(formData.quantity),
        urgency: formData.urgency as 'normal' | 'urgent' | 'emergency',
        location: {
          address: formData.address,
          coordinates: { lat: -1.2921, lng: 36.8219 }, // Nairobi coordinates
        },
        timeWindow: {
          requestedAt: new Date().toISOString(),
          preferredTime: formData.preferredTime as 'asap' | 'scheduled',
        },
        priceEstimate: {
          basePrice: 0, // Will be calculated by the service
          surgeMultiplier: 1,
          finalPrice: 0, // Will be calculated by the service
          currency: 'KES' as const,
        },
      };

      const pricing = await wasteBoltService.calculatePricing(mockRequest);
      setPriceEstimate(pricing.finalPrice);
      setSurgeMultiplier(pricing.surgeMultiplier);

      // Check nearby collectors
      const collectors = await wasteBoltService.findNearbyCollectors(
        mockRequest.location.coordinates,
        formData.wasteType
      );
      setNearbyCollectors(collectors.length);
    } catch (error) {
      console.error('Failed to calculate price:', error);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [formData.wasteType, formData.quantity, formData.urgency]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request waste collection",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const request = await wasteBoltService.requestWasteCollection({
        userId: user.id,
        wasteType: formData.wasteType as 'plastic' | 'organic' | 'hazardous' | 'electronic' | 'mixed',
        quantity: parseFloat(formData.quantity),
        urgency: formData.urgency as 'normal' | 'urgent' | 'emergency',
        location: {
          address: formData.address,
          coordinates: { lat: -1.2921, lng: 36.8219 }, // Would get from geocoding
          floor: formData.floor,
          specialInstructions: formData.specialInstructions,
        },
        timeWindow: {
          requestedAt: new Date().toISOString(),
          preferredTime: formData.preferredTime as 'asap' | 'scheduled',
          scheduledTime: formData.scheduledTime || undefined,
        },
        photos: formData.photos,
        priceEstimate: {
          basePrice: priceEstimate || 0,
          surgeMultiplier: surgeMultiplier,
          finalPrice: priceEstimate || 0,
          currency: 'KES' as const,
        },
      });

      toast({
        title: "Collection Requested!",
        description: `Your waste collection has been requested. ${nearbyCollectors} collectors nearby have been notified.`,
      });

      // Reset form
      setFormData({
        wasteType: '',
        quantity: '',
        urgency: 'normal',
        address: '',
        floor: '',
        specialInstructions: '',
        preferredTime: 'asap',
        scheduledTime: '',
        photos: [],
      });
      setCurrentStep(1);
      setPriceEstimate(null);

    } catch (error: unknown) {
      const errorData = error as { message: string };
      toast({
        title: "Request Failed",
        description: errorData.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">What type of waste do you have?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {wasteTypes.map((type) => (
                  <Card
                    key={type.value}
                    className={`p-4 cursor-pointer transition-all ${
                      formData.wasteType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setFormData({...formData, wasteType: type.value})}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">KES {type.basePrice}/kg</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label>Quantity (kg) *</Label>
              <Input
                type="number"
                placeholder="Enter approximate weight in kg"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>

            <div>
              <Label>Urgency Level</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{level.label}</span>
                        <Badge variant="outline" className="ml-2">
                          {level.multiplier}x
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Where should we collect from?</h3>
              <div className="space-y-4">
                <div>
                  <Label>Pickup Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your address in Nairobi"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Floor/Building Details</Label>
                  <Input
                    placeholder="e.g., 2nd floor, House A-15"
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Special Instructions</Label>
                  <Textarea
                    placeholder="Any special instructions for the collector (gate codes, parking, etc.)"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Preferred Collection Time</Label>
              <Select value={formData.preferredTime} onValueChange={(value) => setFormData({...formData, preferredTime: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">As Soon As Possible</SelectItem>
                  <SelectItem value="scheduled">Schedule Later</SelectItem>
                </SelectContent>
              </Select>

              {formData.preferredTime === 'scheduled' && (
                <div className="mt-2">
                  <Input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
              
              {/* Price Summary */}
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Price Estimate
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    KES {priceEstimate || 0}
                  </span>
                </div>
                
                {surgeMultiplier > 1 && (
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    Surge pricing active ({surgeMultiplier}x multiplier)
                  </div>
                )}

                <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>KES {Math.round((priceEstimate || 0) / surgeMultiplier)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Urgency Multiplier:</span>
                    <span>{formData.urgency === 'urgent' ? '1.5x' : formData.urgency === 'emergency' ? '2.0x' : '1.0x'}</span>
                  </div>
                </div>
              </Card>

              {/* Request Summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Waste Type:</span>
                  <span>{wasteTypes.find(t => t.value === formData.wasteType)?.label}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Quantity:</span>
                  <span>{formData.quantity} kg</span>
                </div>

                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Urgency:</span>
                  <span>{urgencyLevels.find(l => l.value === formData.urgency)?.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Address:</span>
                  <span>{formData.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Nearby Collectors:</span>
                  <span className="text-green-600">{nearbyCollectors} available</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">Request Collection</h1>
        <p className="text-muted-foreground text-lg">
          On-demand waste collection, inspired by Bolt
        </p>
      </header>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2 space-x-8 text-sm">
          <span className={currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}>
            Waste Details
          </span>
          <span className={currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}>
            Location & Time
          </span>
          <span className={currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}>
            Review & Confirm
          </span>
        </div>
      </div>

      {/* Main Content */}
      <Card className="p-6 max-w-2xl mx-auto">
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!formData.wasteType || !formData.quantity)) ||
                (currentStep === 2 && !formData.address)
              }
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !user}
            >
              {loading ? 'Requesting...' : user ? 'Request Collection' : 'Sign In Required'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RequestCollection;
