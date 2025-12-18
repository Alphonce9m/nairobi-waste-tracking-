import { createClient } from '@/utils/supabase/client';
import { Location } from '@/types/marketplace';

const supabase = createClient();

interface Hauler {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  capacityKg: number;
  currentLocation: Location;
  isAvailable: boolean;
  rating: number;
}

export class LogisticsService {
  private static instance: LogisticsService;
  private haulers: Hauler[] = [];
  private readonly HAULER_RADIUS_KM = 20; // Default search radius for haulers

  private constructor() {
    this.initializeHaulers();
  }

  public static getInstance(): LogisticsService {
    if (!LogisticsService.instance) {
      LogisticsService.instance = new LogisticsService();
    }
    return LogisticsService.instance;
  }

  private async initializeHaulers() {
    try {
      const { data, error } = await supabase
        .from('haulers')
        .select('*')
        .eq('is_available', true);

      if (error) throw error;
      this.haulers = data || [];
    } catch (error) {
      console.error('Error initializing haulers:', error);
    }
  }

  public async findAvailableHaulers(
    pickupLocation: Location,
    wasteType: string,
    quantity: number,
    requiredEquipment?: string[]
  ): Promise<Hauler[]> {
    try {
      // Find haulers within radius that can handle the waste type and quantity
      const suitableHaulers = this.haulers.filter(hauler => {
        const distance = this.calculateDistance(
          pickupLocation.latitude,
          pickupLocation.longitude,
          hauler.currentLocation.latitude,
          hauler.currentLocation.longitude
        );

        const hasCapacity = hauler.capacityKg >= quantity;
        const isInRange = distance <= this.HAULER_RADIUS_KM;
        
        // Check if hauler has required equipment if specified
        const hasEquipment = requiredEquipment 
          ? requiredEquipment.every(eq => hauler.vehicleType.includes(eq))
          : true;

        return hasCapacity && isInRange && hasEquipment;
      });

      // Sort by distance and rating
      return suitableHaulers.sort((a, b) => {
        const distA = this.calculateDistance(
          pickupLocation.latitude,
          pickupLocation.longitude,
          a.currentLocation.latitude,
          a.currentLocation.longitude
        );
        
        const distB = this.calculateDistance(
          pickupLocation.latitude,
          pickupLocation.longitude,
          b.currentLocation.latitude,
          b.currentLocation.longitude
        );

        // Prioritize higher rated haulers, then by distance
        if (a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        return distA - distB;
      });
    } catch (error) {
      console.error('Error finding available haulers:', error);
      return [];
    }
  }

  public async schedulePickup(
    listingId: string,
    buyerId: string,
    pickupTime: string,
    notes?: string
  ) {
    try {
      // In a real app, this would:
      // 1. Find an available hauler
      // 2. Create a pickup request
      // 3. Notify the hauler
      // 4. Return booking details
      
      const { data, error } = await supabase
        .from('pickup_requests')
        .insert({
          listing_id: listingId,
          buyer_id: buyerId,
          scheduled_time: pickupTime,
          status: 'pending',
          notes
        })
        .select()
        .single();

      if (error) throw error;
      
      // Simulate hauler assignment (in reality, this would be async)
      setTimeout(() => this.assignHauler(data.id), 5000);
      
      return { success: true, pickupRequest: data };
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      return { success: false, error };
    }
  }

  private async assignHauler(pickupRequestId: string) {
    // In a real app, this would:
    // 1. Find the best available hauler
    // 2. Send them the pickup request
    // 3. Update the request status based on their response
    
    console.log(`Assigning hauler for pickup request ${pickupRequestId}`);
    
    // Simulate hauler assignment after a delay
    setTimeout(async () => {
      await supabase
        .from('pickup_requests')
        .update({ status: 'assigned' })
        .eq('id', pickupRequestId);
    }, 2000);
  }

  public async trackPickup(pickupRequestId: string) {
    // In a real app, this would get real-time location from the hauler's device
    return {
      status: 'in_transit',
      estimatedArrival: '15 min',
      haulerLocation: {
        lat: -1.2921 + (Math.random() * 0.01 - 0.005), // Random location near Nairobi
        lng: 36.8219 + (Math.random() * 0.01 - 0.005)
      },
      lastUpdated: new Date().toISOString()
    };
  }

  public async calculateDeliveryEstimate(
    pickupLocation: Location,
    dropoffLocation: Location,
    quantity: number
  ) {
    // Simple distance-based calculation
    const distance = this.calculateDistance(
      pickupLocation.latitude,
      pickupLocation.longitude,
      dropoffLocation.latitude,
      dropoffLocation.longitude
    );

    // Base rate + distance rate + quantity surcharge
    const baseRate = 500; // KES
    const perKmRate = 50; // KES per km
    const quantitySurcharge = Math.max(0, (quantity - 100) * 0.5); // 0.5 KES per kg over 100kg

    const total = baseRate + (distance * perKmRate) + quantitySurcharge;
    
    // Estimate time (30 min base + 2 min per km)
    const estimatedMinutes = Math.round(30 + (distance * 2));
    
    return {
      estimatedCost: Math.round(total),
      estimatedTime: estimatedMinutes,
      distance: parseFloat(distance.toFixed(1))
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula to calculate distance between two points in km
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

export const logisticsService = LogisticsService.getInstance();
