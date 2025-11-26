import { realtimeService } from './realtimeService';

export interface Collector {
  id: string;
  name: string;
  groupId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  specialization: string[];
  isOnline: boolean;
  currentLoad: number; // Current number of active requests
  maxLoad: number; // Maximum concurrent requests
  rating: number;
  responseTime: number; // Average response time in minutes
  phone: string;
  vehicleType?: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  wasteType: 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed';
  quantity: number;
  location: string;
  coordinates?: { lat: number; lng: number };
  urgency: 'normal' | 'urgent' | 'emergency';
  description?: string;
  estimatedPrice: number;
  status: 'pending' | 'matched' | 'accepted' | 'en_route' | 'collecting' | 'completed';
  createdAt: string;
}

export interface MatchResult {
  collector: Collector;
  distance: number; // in kilometers
  estimatedTime: number; // in minutes
  score: number; // Matching score (0-100)
  reasons: string[]; // Why this collector was matched
}

class MatchingService {
  private collectors: Collector[] = [];
  
  // Nairobi area coordinates for geolocation
  private nairobiBounds = {
    north: -1.1,
    south: -1.4,
    east: 37.1,
    west: 36.7
  };

  constructor() {
    this.initializeMockCollectors();
  }

  private initializeMockCollectors() {
    // Mock collectors in different Nairobi areas
    this.collectors = [
      {
        id: 'collector-1',
        name: 'Nairobi Waste Collectors Co.',
        groupId: 'group-1',
        location: {
          lat: -1.2921,
          lng: 36.8219,
          address: 'CBD, Nairobi'
        },
        specialization: ['plastic', 'organic', 'mixed'],
        isOnline: true,
        currentLoad: 2,
        maxLoad: 5,
        rating: 4.5,
        responseTime: 15,
        phone: '+254 712 345 678',
        vehicleType: 'Truck'
      },
      {
        id: 'collector-2',
        name: 'Westlands Environmental Services',
        groupId: 'group-2',
        location: {
          lat: -1.2654,
          lng: 36.7969,
          address: 'Westlands, Nairobi'
        },
        specialization: ['electronic', 'hazardous'],
        isOnline: true,
        currentLoad: 1,
        maxLoad: 3,
        rating: 4.8,
        responseTime: 10,
        phone: '+254 723 456 789',
        vehicleType: 'Van'
      },
      {
        id: 'collector-3',
        name: 'Kilimani Green Solutions',
        groupId: 'group-3',
        location: {
          lat: -1.3001,
          lng: 36.7830,
          address: 'Kilimani, Nairobi'
        },
        specialization: ['plastic', 'organic'],
        isOnline: false,
        currentLoad: 0,
        maxLoad: 4,
        rating: 4.2,
        responseTime: 20,
        phone: '+254 734 567 890',
        vehicleType: 'Bike'
      },
      {
        id: 'collector-4',
        name: 'Karen Waste Management',
        groupId: 'group-4',
        location: {
          lat: -1.3176,
          lng: 36.7520,
          address: 'Karen, Nairobi'
        },
        specialization: ['organic', 'mixed', 'hazardous'],
        isOnline: true,
        currentLoad: 3,
        maxLoad: 6,
        rating: 4.6,
        responseTime: 12,
        phone: '+254 745 678 901',
        vehicleType: 'Truck'
      }
    ];
  }

  // Calculate distance between two coordinates using Haversine formula
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Estimate travel time based on distance and Nairobi traffic conditions
  private estimateTravelTime(distance: number): number {
    // Base speed: 30 km/h in Nairobi traffic
    const baseSpeed = 30;
    const baseTime = (distance / baseSpeed) * 60; // Convert to minutes
    
    // Add traffic delay based on time of day
    const currentHour = new Date().getHours();
    let trafficMultiplier = 1;
    
    if ((currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19)) {
      trafficMultiplier = 2; // Rush hour
    } else if (currentHour >= 10 && currentHour <= 16) {
      trafficMultiplier = 1.3; // Moderate traffic
    }
    
    return baseTime * trafficMultiplier;
  }

  // Calculate matching score for a collector
  private calculateMatchScore(request: ServiceRequest, collector: Collector): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Check if collector is online
    if (!collector.isOnline) {
      return { score: 0, reasons: ['Collector is offline'] };
    }

    // Check if collector can handle more requests
    if (collector.currentLoad >= collector.maxLoad) {
      return { score: 0, reasons: ['Collector at maximum capacity'] };
    }

    // Check specialization match
    if (collector.specialization.includes(request.wasteType)) {
      score += 30;
      reasons.push('Specializes in this waste type');
    } else {
      score -= 20;
      reasons.push('Does not specialize in this waste type');
    }

    // Check rating
    score += collector.rating * 10;
    if (collector.rating >= 4.5) {
      reasons.push('Highly rated collector');
    }

    // Check response time
    if (collector.responseTime <= 15) {
      score += 15;
      reasons.push('Fast response time');
    } else if (collector.responseTime > 30) {
      score -= 10;
      reasons.push('Slow response time');
    }

    // Check current load
    const loadRatio = collector.currentLoad / collector.maxLoad;
    if (loadRatio <= 0.4) {
      score += 10;
      reasons.push('Low current workload');
    } else if (loadRatio >= 0.8) {
      score -= 10;
      reasons.push('High current workload');
    }

    // Urgency bonus for emergency requests
    if (request.urgency === 'emergency' && collector.responseTime <= 10) {
      score += 20;
      reasons.push('Available for emergency requests');
    }

    return { score: Math.max(0, score), reasons };
  }

  // Find nearby collectors for a service request
  async findNearbyCollectors(request: ServiceRequest): Promise<MatchResult[]> {
    const results: MatchResult[] = [];

    // Get request coordinates (mock for now - in real app, would geocode the address)
    const requestCoords = request.coordinates || this.geocodeLocation(request.location);

    for (const collector of this.collectors) {
      // Calculate distance
      const distance = this.calculateDistance(
        requestCoords.lat,
        requestCoords.lng,
        collector.location.lat,
        collector.location.lng
      );

      // Only consider collectors within 10km
      if (distance > 10) {
        continue;
      }

      // Calculate estimated time
      const estimatedTime = this.estimateTravelTime(distance);

      // Calculate match score
      const { score, reasons } = this.calculateMatchScore(request, collector);

      if (score > 0) {
        results.push({
          collector,
          distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          estimatedTime: Math.round(estimatedTime),
          score,
          reasons
        });
      }
    }

    // Sort by score (highest first), then by distance
    results.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.distance - b.distance;
    });

    return results;
  }

  // Geocode location to coordinates (mock implementation)
  private geocodeLocation(location: string): { lat: number; lng: number } {
    // Mock geocoding for common Nairobi areas
    const locationMap: { [key: string]: { lat: number; lng: number } } = {
      'cbd': { lat: -1.2921, lng: 36.8219 },
      'westlands': { lat: -1.2654, lng: 36.7969 },
      'kilimani': { lat: -1.3001, lng: 36.7830 },
      'karen': { lat: -1.3176, lng: 36.7520 },
      'nairobi': { lat: -1.2921, lng: 36.8219 },
    };

    const lowerLocation = location.toLowerCase();
    for (const [key, coords] of Object.entries(locationMap)) {
      if (lowerLocation.includes(key)) {
        return coords;
      }
    }

    // Default to CBD if not found
    return { lat: -1.2921, lng: 36.8219 };
  }

  // Match request with best available collector
  async matchRequest(request: ServiceRequest): Promise<MatchResult | null> {
    const matches = await this.findNearbyCollectors(request);
    
    if (matches.length === 0) {
      return null;
    }

    // Return the best match
    return matches[0];
  }

  // Broadcast request to matched collectors
  async broadcastToCollectors(request: ServiceRequest, matches: MatchResult[]): Promise<void> {
    for (const match of matches.slice(0, 3)) { // Top 3 matches
      // In a real implementation, this would send notifications to specific collectors
      console.log(`Broadcasting request ${request.id} to collector ${match.collector.name}`);
      
      // Update collector status
      const collector = this.collectors.find(c => c.id === match.collector.id);
      if (collector) {
        collector.currentLoad++;
      }
    }

    // Broadcast via real-time service
    await realtimeService.broadcastRequestUpdate({
      ...request,
      status: 'matched',
      matchedCollectorId: matches[0]?.collector.id,
      matchedCollectorName: matches[0]?.collector.name,
      collectorPhone: matches[0]?.collector.phone,
      eta: new Date(Date.now() + matches[0]?.estimatedTime * 60 * 1000).toLocaleTimeString(),
    });
  }

  // Get collector by ID
  getCollector(collectorId: string): Collector | null {
    return this.collectors.find(c => c.id === collectorId) || null;
  }

  // Update collector status
  updateCollectorStatus(collectorId: string, status: Partial<Collector>): void {
    const collector = this.collectors.find(c => c.id === collectorId);
    if (collector) {
      Object.assign(collector, status);
    }
  }

  // Get all online collectors
  getOnlineCollectors(): Collector[] {
    return this.collectors.filter(c => c.isOnline);
  }
}

export const matchingService = new MatchingService();
