import { Collection, WasteCollector, WasteRequest } from '@/types/boltWaste';

export interface OptimizedRoute {
  id: string;
  collectorId: string;
  requests: WasteRequest[];
  waypoints: {
    coordinates: { lat: number; lng: number };
    address: string;
    estimatedArrival: string;
    wasteType: string;
    quantity: number;
  }[];
  totalDistance: number; // in km
  estimatedDuration: number; // in minutes
  totalEarnings: number; // in KES
  efficiency: number; // 0-100 score
  optimization: {
    timeSaved: number; // minutes saved vs unoptimized
    fuelSaved: number; // liters saved
    additionalEarnings: number; // potential extra earnings
  };
}

export interface TrafficData {
  coordinates: { lat: number; lng: number };
  congestionLevel: 'low' | 'medium' | 'high';
  averageSpeed: number; // km/h
  delayFactor: number; // multiplier for travel time
}

export interface WeatherImpact {
  condition: 'clear' | 'rain' | 'heavy_rain' | 'fog';
  speedReduction: number; // percentage
  visibilityImpact: number; // percentage
  safetyRisk: 'low' | 'medium' | 'high';
}

export class RouteOptimizerAI {
  private trafficData: Map<string, TrafficData> = new Map();
  private weatherImpact: WeatherImpact = { condition: 'clear', speedReduction: 0, visibilityImpact: 0, safetyRisk: 'low' };

  constructor() {
    this.initializeTrafficData();
  }

  // Main optimization function
  async optimizeRoute(
    collector: WasteCollector,
    availableRequests: WasteRequest[],
    currentLocation?: { lat: number; lng: number }
  ): Promise<OptimizedRoute> {
    // Filter requests based on collector's specializations and capacity
    const compatibleRequests = this.filterCompatibleRequests(collector, availableRequests);
    
    // Sort by urgency, proximity, and earnings potential
    const prioritizedRequests = this.prioritizeRequests(collector, compatibleRequests, currentLocation);
    
    // Generate optimal route using advanced algorithms
    const optimizedRoute = await this.generateOptimalRoute(collector, prioritizedRequests, currentLocation);
    
    return optimizedRoute;
  }

  // Filter requests based on collector capabilities
  private filterCompatibleRequests(collector: WasteCollector, requests: WasteRequest[]): WasteRequest[] {
    return requests.filter(request => {
      // Check specialization match
      const canHandleWaste = collector.specializations.includes(request.wasteType);
      
      // Check capacity constraints
      const fitsCapacity = request.quantity <= collector.vehicle.capacity;
      
      // Check distance constraints (max 20km for efficiency)
      const distance = this.calculateDistance(
        collector.location.coordinates,
        request.location.coordinates
      );
      const withinRange = distance <= 20;
      
      return canHandleWaste && fitsCapacity && withinRange;
    });
  }

  // Prioritize requests using AI scoring
  private prioritizeRequests(
    collector: WasteCollector,
    requests: WasteRequest[],
    currentLocation?: { lat: number; lng: number }
  ): WasteRequest[] {
    return requests.map(request => {
      let score = 0;
      
      // Urgency scoring (higher for urgent requests)
      const urgencyScores = { normal: 10, urgent: 25, emergency: 40 };
      score += urgencyScores[request.urgency];
      
      // Distance scoring (closer is better)
      const distance = this.calculateDistance(
        currentLocation || collector.location.coordinates,
        request.location.coordinates
      );
      score += Math.max(0, 50 - distance * 2); // 50 points max, decreasing with distance
      
      // Earnings potential scoring
      score += (request.priceEstimate.finalPrice / 10); // 1 point per KES 10
      
      // Time window scoring
      if (request.timeWindow.preferredTime === 'asap') {
        score += 20; // Bonus for ASAP requests
      }
      
      // Traffic consideration
      const trafficKey = `${request.location.coordinates.lat.toFixed(3)},${request.location.coordinates.lng.toFixed(3)}`;
      const traffic = this.trafficData.get(trafficKey);
      if (traffic) {
        score -= traffic.congestionLevel === 'high' ? 20 : traffic.congestionLevel === 'medium' ? 10 : 0;
      }
      
      return { ...request, aiScore: score };
    }).sort((a, b) => (b as { aiScore: number }).aiScore - (a as { aiScore: number }).aiScore);
  }

  // Generate optimal route using traveling salesman algorithm with real-world constraints
  private async generateOptimalRoute(
    collector: WasteCollector,
    requests: WasteRequest[],
    currentLocation?: { lat: number; lng: number }
  ): Promise<OptimizedRoute> {
    const maxRequests = Math.min(requests.length, 8); // Limit to 8 requests for efficiency
    const selectedRequests = requests.slice(0, maxRequests);
    
    // Start from collector's current location
    const waypoints = currentLocation ? [currentLocation] : [collector.location.coordinates];
    const remainingRequests = [...selectedRequests];
    let totalDistance = 0;
    let totalEarnings = 0;
    let estimatedDuration = 0;
    
    const routeWaypoints = [];
    
    // Greedy nearest neighbor algorithm with optimizations
    while (remainingRequests.length > 0) {
      const currentPos = waypoints[waypoints.length - 1];
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      
      // Find nearest remaining request
      remainingRequests.forEach((request, index) => {
        const distance = this.calculateDistance(currentPos, request.location.coordinates);
        
        // Apply traffic and weather adjustments
        const adjustedDistance = this.adjustDistanceForConditions(distance, request.location.coordinates);
        
        if (adjustedDistance < nearestDistance) {
          nearestDistance = adjustedDistance;
          nearestIndex = index;
        }
      });
      
      // Add to route
      const nextRequest = remainingRequests[nearestIndex];
      waypoints.push(nextRequest.location.coordinates);
      routeWaypoints.push({
        coordinates: nextRequest.location.coordinates,
        address: nextRequest.location.address,
        estimatedArrival: this.calculateETA(waypoints.length - 1, waypoints),
        wasteType: nextRequest.wasteType,
        quantity: nextRequest.quantity,
      });
      
      totalDistance += nearestDistance;
      totalEarnings += nextRequest.priceEstimate.finalPrice;
      estimatedDuration += this.calculateTravelTime(nearestDistance, nextRequest.location.coordinates);
      
      // Add collection time (5-15 minutes based on quantity)
      estimatedDuration += Math.min(15, Math.max(5, nextRequest.quantity / 10));
      
      remainingRequests.splice(nearestIndex, 1);
    }
    
    // Calculate efficiency metrics
    const efficiency = this.calculateEfficiency(totalDistance, totalEarnings, estimatedDuration);
    const optimization = this.calculateOptimizationBenefits(selectedRequests, totalDistance, estimatedDuration);
    
    return {
      id: `route-${Date.now()}`,
      collectorId: collector.id,
      requests: selectedRequests,
      waypoints: routeWaypoints,
      totalDistance,
      estimatedDuration,
      totalEarnings,
      efficiency,
      optimization,
    };
  }

  // Calculate distance between two points
  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Adjust distance for traffic and weather conditions
  private adjustDistanceForConditions(baseDistance: number, coordinates: { lat: number; lng: number }): number {
    let adjustedDistance = baseDistance;
    
    // Traffic adjustment
    const trafficKey = `${coordinates.lat.toFixed(3)},${coordinates.lng.toFixed(3)}`;
    const traffic = this.trafficData.get(trafficKey);
    if (traffic) {
      adjustedDistance *= traffic.delayFactor;
    }
    
    // Weather adjustment
    adjustedDistance *= (1 + this.weatherImpact.speedReduction / 100);
    
    return adjustedDistance;
  }

  // Calculate travel time considering conditions
  private calculateTravelTime(distance: number, coordinates: { lat: number; lng: number }): number {
    let averageSpeed = 40; // Base speed in km/h for Nairobi
    
    // Adjust for traffic
    const trafficKey = `${coordinates.lat.toFixed(3)},${coordinates.lng.toFixed(3)}`;
    const traffic = this.trafficData.get(trafficKey);
    if (traffic) {
      averageSpeed = traffic.averageSpeed;
    }
    
    // Adjust for weather
    averageSpeed *= (1 - this.weatherImpact.speedReduction / 100);
    
    return (distance / averageSpeed) * 60; // Convert to minutes
  }

  // Calculate ETA for waypoint
  private calculateETA(waypointIndex: number, waypoints: { lat: number; lng: number }[]): string {
    const now = new Date();
    let totalMinutes = 0;
    
    for (let i = 1; i <= waypointIndex; i++) {
      const distance = this.calculateDistance(waypoints[i-1], waypoints[i]);
      const travelTime = this.calculateTravelTime(distance, waypoints[i]);
      totalMinutes += travelTime + 10; // Add 10 min buffer per stop
    }
    
    const eta = new Date(now.getTime() + totalMinutes * 60000);
    return eta.toISOString();
  }

  // Calculate route efficiency score
  private calculateEfficiency(distance: number, earnings: number, duration: number): number {
    // Higher earnings per km and per minute = higher efficiency
    const earningsPerKm = earnings / distance;
    const earningsPerMinute = earnings / duration;
    
    // Normalize to 0-100 scale
    const efficiencyScore = Math.min(100, (earningsPerKm * 2 + earningsPerMinute * 5));
    
    return Math.round(efficiencyScore);
  }

  // Calculate optimization benefits
  private calculateOptimizationBenefits(
    originalRequests: WasteRequest[],
    optimizedDistance: number,
    optimizedDuration: number
  ): { timeSaved: number; fuelSaved: number; additionalEarnings: number } {
    // Calculate unoptimized route (simple sequential order)
    let unoptimizedDistance = 0;
    let unoptimizedDuration = 0;
    
    for (let i = 0; i < originalRequests.length - 1; i++) {
      const distance = this.calculateDistance(
        originalRequests[i].location.coordinates,
        originalRequests[i + 1].location.coordinates
      );
      unoptimizedDistance += distance;
      unoptimizedDuration += this.calculateTravelTime(distance, originalRequests[i + 1].location.coordinates);
    }
    
    const timeSaved = unoptimizedDuration - optimizedDuration;
    const fuelSaved = (unoptimizedDistance - optimizedDistance) * 0.1; // Assume 0.1L per km
    const additionalEarnings = Math.round(timeSaved * 2); // KES 2 per minute saved
    
    return {
      timeSaved: Math.max(0, timeSaved),
      fuelSaved: Math.max(0, fuelSaved),
      additionalEarnings: Math.max(0, additionalEarnings),
    };
  }

  // Initialize mock traffic data for Nairobi
  private initializeTrafficData(): void {
    // Major Nairobi areas with typical traffic patterns
    const nairobiTraffic: { [key: string]: TrafficData } = {
      '-1.292,36.821': { // CBD
        coordinates: { lat: -1.292, lng: 36.821 },
        congestionLevel: 'high',
        averageSpeed: 20,
        delayFactor: 1.8,
      },
      '-1.285,36.820': { // Westlands
        coordinates: { lat: -1.285, lng: 36.820 },
        congestionLevel: 'medium',
        averageSpeed: 35,
        delayFactor: 1.3,
      },
      '-1.280,36.815': { // Kilimani
        coordinates: { lat: -1.280, lng: 36.815 },
        congestionLevel: 'medium',
        averageSpeed: 30,
        delayFactor: 1.4,
      },
      '-1.265,36.810': { // Upper Hill
        coordinates: { lat: -1.265, lng: 36.810 },
        congestionLevel: 'high',
        averageSpeed: 25,
        delayFactor: 1.6,
      },
    };
    
    Object.entries(nairobiTraffic).forEach(([key, data]) => {
      this.trafficData.set(key, data);
    });
  }

  // Update weather conditions
  updateWeatherConditions(weather: WeatherImpact): void {
    this.weatherImpact = weather;
  }

  // Get real-time traffic updates
  async updateTrafficData(): Promise<void> {
    // In a real implementation, this would fetch from traffic APIs
    // For now, we'll simulate random traffic changes
    this.trafficData.forEach((traffic, key) => {
      const random = Math.random();
      if (random > 0.8) {
        traffic.congestionLevel = traffic.congestionLevel === 'high' ? 'medium' : 'high';
        traffic.delayFactor = traffic.congestionLevel === 'high' ? 1.8 : 1.4;
        traffic.averageSpeed = traffic.congestionLevel === 'high' ? 20 : 30;
      }
    });
  }
}

export const routeOptimizerAI = new RouteOptimizerAI();
