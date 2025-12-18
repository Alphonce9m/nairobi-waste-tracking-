import { createClient } from '@/utils/supabase/client';
import { WasteCategory } from '@/types/marketplace';

const supabase = createClient();

export interface PriceSuggestion {
  minPrice: number;
  maxPrice: number;
  suggestedPrice: number;
  confidence: 'low' | 'medium' | 'high';
  lastUpdated: string;
  marketTrend: 'up' | 'down' | 'stable';
  unit: string;
}

export class PricingService {
  private static instance: PricingService;
  private cache: Map<string, { data: PriceSuggestion; timestamp: number }> = new Map();
  private CACHE_TTL = 3600000; // 1 hour in milliseconds

  private constructor() {}

  public static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  private async fetchMarketData(wasteType: WasteType, location: { lat: number; lng: number }): Promise<PriceSuggestion> {
    // Check cache first
    const cacheKey = `${wasteType}-${location.lat.toFixed(2)}-${location.lng.toFixed(2)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      // Fetch historical transactions for similar waste types in the area
      const { data: transactions, error } = await supabase
        .rpc('get_similar_transactions', {
          p_waste_type: wasteType,
          p_lat: location.lat,
          p_lng: location.lng,
          p_radius_km: 50, // 50km radius
          p_days: 30 // Last 30 days
        });

      if (error) throw error;

      // Calculate price statistics
      const prices = transactions.map((t: any) => t.price_per_unit);
      const avgPrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Simple market trend analysis (in a real app, this would be more sophisticated)
      const recentPrices = transactions
        .filter((t: any) => new Date(t.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .map((t: any) => t.price_per_unit);
      
      const recentAvg = recentPrices.reduce((a: number, b: number) => a + b, 0) / (recentPrices.length || 1);
      const trend = recentAvg > avgPrice ? 'up' : recentAvg < avgPrice ? 'down' : 'stable';

      // Confidence based on data points
      const confidence = prices.length > 20 ? 'high' : prices.length > 5 ? 'medium' : 'low';

      const result: PriceSuggestion = {
        minPrice,
        maxPrice,
        suggestedPrice: parseFloat(avgPrice.toFixed(2)),
        confidence,
        lastUpdated: new Date().toISOString(),
        marketTrend: trend,
        unit: 'kg' // Default unit, could be dynamic based on waste type
      };

      // Update cache
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Return default values if API fails
      return {
        minPrice: 0,
        maxPrice: 0,
        suggestedPrice: 0,
        confidence: 'low',
        lastUpdated: new Date().toISOString(),
        marketTrend: 'stable',
        unit: 'kg'
      };
    }
  }

  public async getPriceSuggestion(
    wasteType: WasteType,
    location: { lat: number; lng: number },
    quantity: number = 1
  ): Promise<PriceSuggestion> {
    const baseSuggestion = await this.fetchMarketData(wasteType, location);
    
    // Apply quantity discount (example: 5% discount for > 1000kg)
    let finalPrice = baseSuggestion.suggestedPrice;
    if (quantity > 1000) {
      finalPrice *= 0.95;
    }

    return {
      ...baseSuggestion,
      suggestedPrice: parseFloat(finalPrice.toFixed(2)),
      minPrice: parseFloat((baseSuggestion.minPrice * 0.9).toFixed(2)), // 10% below suggested
      maxPrice: parseFloat((baseSuggestion.maxPrice * 1.1).toFixed(2))  // 10% above suggested
    };
  }

  public async getBulkPriceEstimate(
    wasteType: WasteType,
    location: { lat: number; lng: number },
    quantities: number[]
  ): Promise<{ quantity: number; price: number }[]> {
    const basePrice = (await this.fetchMarketData(wasteType, location)).suggestedPrice;
    
    return quantities.map(quantity => {
      let price = basePrice;
      // Apply volume discounts
      if (quantity > 5000) price *= 0.9;  // 10% off for large quantities
      else if (quantity > 1000) price *= 0.95; // 5% off for medium quantities
      
      return {
        quantity,
        price: parseFloat((price * quantity).toFixed(2))
      };
    });
  }
}

export const pricingService = PricingService.getInstance();
