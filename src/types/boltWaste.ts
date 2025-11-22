// Bolt-inspired waste marketplace types

export interface WasteRequest {
  id: string;
  userId: string;
  wasteType: 'plastic' | 'organic' | 'hazardous' | 'electronic' | 'mixed';
  quantity: number; // in kg
  urgency: 'normal' | 'urgent' | 'emergency';
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    floor?: string;
    specialInstructions?: string;
  };
  timeWindow: {
    requestedAt: string;
    preferredTime: 'asap' | 'scheduled';
    scheduledTime?: string;
  };
  photos?: string[];
  specialRequirements?: string[];
  priceEstimate: {
    basePrice: number;
    surgeMultiplier: number;
    finalPrice: number;
    currency: 'KES';
  };
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface WasteCollector {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: {
    type: 'truck' | 'motorcycle' | 'handcart';
    capacity: number; // in kg
    registrationNumber: string;
    photos: string[];
  };
  location: {
    coordinates: { lat: number; lng: number };
    lastUpdated: string;
  };
  availability: {
    isOnline: boolean;
    currentStatus: 'available' | 'busy' | 'offline';
    nextAvailableTime?: string;
  };
  specializations: string[]; // e.g., ['hazardous', 'electronic']
  ratings: {
    average: number;
    totalRatings: number;
    categories: {
      punctuality: number;
      professionalism: number;
      wasteHandling: number;
      environmentalCompliance: number;
    };
  };
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    totalEarnings: number;
  };
  verification: {
    isVerified: boolean;
    documents: string[];
    verifiedAt?: string;
  };
}

export interface Collection {
  id: string;
  requestId: string;
  collectorId: string;
  status: 'assigned' | 'en_route' | 'arrived' | 'collecting' | 'completed' | 'cancelled';
  timeline: {
    assignedAt: string;
    enRouteAt?: string;
    arrivedAt?: string;
    startedAt?: string;
    completedAt?: string;
  };
  route?: {
    coordinates: { lat: number; lng: number }[];
    estimatedArrival: string;
    distance: number; // in km
  };
  actualCollected?: {
    quantity: number;
    photos: string[];
    notes?: string;
  };
  payment: {
    amount: number;
    commissionRate: number;
    platformFee: number;
    collectorEarnings: number;
    status: 'pending' | 'paid' | 'refunded';
    paidAt?: string;
  };
  rating?: {
    userId: number;
    collectorRating: number;
    userRating: number;
    feedback?: string;
    ratedAt: string;
  };
}

export interface SurgePricing {
  isActive: boolean;
  multiplier: number;
  reason: 'high_demand' | 'bad_weather' | 'peak_hours' | 'special_event';
  affectedAreas: string[];
  startTime: string;
  endTime?: string;
}

export interface MarketplaceMetrics {
  totalRequests: number;
  activeCollectors: number;
  averageResponseTime: number; // in minutes
  completionRate: number;
  averageRating: number;
  revenueMetrics: {
    todayRevenue: number;
    monthlyRevenue: number;
    commissionEarned: number;
  };
}
