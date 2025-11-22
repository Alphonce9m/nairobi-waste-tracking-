import { createClient } from '@/utils/supabase/client';
import { WasteRequest, WasteCollector, Collection, SurgePricing } from '@/types/boltWaste';

const supabase = createClient();

export class WasteBoltService {
  // Core Bolt-inspired functionality

  // 1. Request waste collection (like requesting a ride)
  async requestWasteCollection(request: Omit<WasteRequest, 'id' | 'createdAt' | 'status'>): Promise<WasteRequest> {
    // Calculate dynamic pricing
    const pricing = await this.calculatePricing(request);
    
    const wasteRequest = {
      ...request,
      priceEstimate: pricing,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    // Save to database
    const { data, error } = await supabase
      .from('waste_requests')
      .insert(wasteRequest)
      .select()
      .single();

    if (error) throw error;

    // Find and notify nearby collectors
    await this.notifyNearbyCollectors(data);

    return data;
  }

  // 2. Find nearby collectors (like finding nearby drivers)
  async findNearbyCollectors(location: { lat: number; lng: number }, wasteType: string): Promise<WasteCollector[]> {
    // In a real app, this would use geospatial queries
    const { data, error } = await supabase
      .from('waste_collectors')
      .select('*')
      .eq('availability.isOnline', true)
      .eq('availability.currentStatus', 'available')
      .contains('specializations', [wasteType])
      .order('ratings.average', { ascending: false });

    if (error) throw error;

    // Filter by distance (simplified - in production use PostGIS)
    return data.filter(collector => {
      const distance = this.calculateDistance(
        location, 
        collector.location.coordinates
      );
      return distance <= 10; // Within 10km
    });
  }

  // 3. Accept collection request (like accepting a ride)
  async acceptCollection(requestId: string, collectorId: string): Promise<Collection> {
    // Create collection record
    const collection = {
      requestId,
      collectorId,
      status: 'assigned' as const,
      timeline: {
        assignedAt: new Date().toISOString(),
      },
      payment: {
        amount: 0, // Will be calculated from request
        commissionRate: 0.15, // 15% commission
        platformFee: 50, // KES 50 platform fee
        collectorEarnings: 0,
        status: 'pending' as const,
      },
    };

    const { data, error } = await supabase
      .from('collections')
      .insert(collection)
      .select()
      .single();

    if (error) throw error;

    // Update request status
    await supabase
      .from('waste_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    // Update collector status
    await supabase
      .from('waste_collectors')
      .update({ 
        'availability.currentStatus': 'busy',
        'availability.lastUpdated': new Date().toISOString()
      })
      .eq('id', collectorId);

    return data;
  }

  // 4. Dynamic pricing (like surge pricing)
  async calculatePricing(request: Omit<WasteRequest, 'id' | 'createdAt' | 'status'>): Promise<WasteRequest['priceEstimate']> {
    const basePrice = this.getBasePrice(request.wasteType, request.quantity);
    let surgeMultiplier = 1;

    // Check for surge pricing
    const surgeInfo = await this.checkSurgePricing(request.location.coordinates);
    if (surgeInfo.isActive) {
      surgeMultiplier = surgeInfo.multiplier;
    }

    // Apply urgency multiplier
    if (request.urgency === 'urgent') {
      surgeMultiplier *= 1.5;
    } else if (request.urgency === 'emergency') {
      surgeMultiplier *= 2.0;
    }

    // Apply time-based multiplier
    const hour = new Date().getHours();
    if (hour >= 17 && hour <= 20) { // Peak hours
      surgeMultiplier *= 1.2;
    }

    const finalPrice = Math.round(basePrice * surgeMultiplier);

    return {
      basePrice,
      surgeMultiplier,
      finalPrice,
      currency: 'KES',
    };
  }

  // 5. Real-time tracking (like GPS tracking)
  async updateCollectorLocation(collectorId: string, coordinates: { lat: number; lng: number }): Promise<void> {
    await supabase
      .from('waste_collectors')
      .update({
        'location.coordinates': coordinates,
        'location.lastUpdated': new Date().toISOString(),
      })
      .eq('id', collectorId);
  }

  // 6. Update collection status (like ride status updates)
  async updateCollectionStatus(
    collectionId: string, 
    status: Collection['status'],
    photos?: string[]
  ): Promise<Collection> {
    const updateData: Record<string, unknown> = {
      status,
      [`timeline.${this.getStatusField(status)}`]: new Date().toISOString(),
    };

    if (photos) {
      updateData.actualCollected = {
        photos,
        quantity: 0, // Would be calculated from photos or manual input
      };
    }

    const { data, error } = await supabase
      .from('collections')
      .update(updateData)
      .eq('id', collectionId)
      .select()
      .single();

    if (error) throw error;

    // If completed, process payment and update collector status
    if (status === 'completed') {
      await this.processPayment(collectionId);
      await this.updateCollectorAvailability(data.collectorId, 'available');
    }

    return data;
  }

  // 7. Rating system (like ride rating)
  async rateCollection(
    collectionId: string,
    userRating: number,
    collectorRating: number,
    feedback?: string
  ): Promise<void> {
    await supabase
      .from('collections')
      .update({
        rating: {
          userId: 1, // Would get from auth
          userRating,
          collectorRating,
          feedback,
          ratedAt: new Date().toISOString(),
        },
      })
      .eq('id', collectionId);

    // Update collector's average rating
    await this.updateCollectorRating(collectionId, collectorRating);
  }

  // Helper methods
  private getBasePrice(wasteType: string, quantity: number): number {
    const basePrices = {
      plastic: 20, // KES per kg
      organic: 15,
      hazardous: 100,
      electronic: 50,
      mixed: 25,
    };
    return (basePrices[wasteType as keyof typeof basePrices] || 25) * quantity;
  }

  private async checkSurgePricing(location: { lat: number; lng: number }): Promise<SurgePricing> {
    // In a real app, this would check current demand, weather, etc.
    // For now, return no surge
    return {
      isActive: false,
      multiplier: 1,
      reason: 'high_demand',
      affectedAreas: [],
      startTime: new Date().toISOString(),
    };
  }

  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    // Simplified distance calculation (Haversine formula would be better)
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private async notifyNearbyCollectors(request: WasteRequest): Promise<void> {
    const nearbyCollectors = await this.findNearbyCollectors(
      request.location.coordinates,
      request.wasteType
    );

    // In a real app, this would send push notifications, SMS, etc.
    console.log(`Notifying ${nearbyCollectors.length} collectors about new request`);
  }

  private getStatusField(status: Collection['status']): string {
    const fieldMap: Record<string, string> = {
      assigned: 'assignedAt',
      en_route: 'enRouteAt',
      arrived: 'arrivedAt',
      collecting: 'startedAt',
      completed: 'completedAt',
      cancelled: 'cancelledAt',
    };
    return fieldMap[status] || 'assignedAt';
  }

  private async processPayment(collectionId: string): Promise<void> {
    // In a real app, this would integrate with payment gateways
    console.log(`Processing payment for collection ${collectionId}`);
  }

  private async updateCollectorAvailability(collectorId: string, status: string): Promise<void> {
    await supabase
      .from('waste_collectors')
      .update({
        'availability.currentStatus': status,
        'availability.lastUpdated': new Date().toISOString(),
      })
      .eq('id', collectorId);
  }

  private async updateCollectorRating(collectionId: string, newRating: number): Promise<void> {
    // Calculate new average rating
    // This would typically involve fetching all ratings and recalculating
    console.log(`Updating collector rating with new rating: ${newRating}`);
  }
}

export const wasteBoltService = new WasteBoltService();
