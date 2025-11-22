import { createClient } from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient();

export interface RealtimeEvent {
  type: 'service_request' | 'request_update' | 'collector_status' | 'marketplace_listing' | 'transaction' | 'message';
  data: unknown;
  timestamp: string;
  userId?: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  wasteType: string;
  quantity: number;
  location: string;
  constituency: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'accepted' | 'en_route' | 'collecting' | 'completed' | 'cancelled';
  estimatedPrice: number;
  createdAt: string;
  updatedAt: string;
  specialInstructions?: string;
  preferredTime: string;
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  eta?: string;
}

export interface CollectorStatus {
  id: string;
  groupId: string;
  isOnline: boolean;
  currentLocation?: { lat: number; lng: number };
  isAvailable: boolean;
  currentRequestId?: string;
  lastActiveAt: string;
  vehicleType?: string;
  specialization: string[];
}

export interface MarketplaceUpdate {
  id: string;
  type: 'listing_created' | 'listing_updated' | 'listing_sold' | 'transaction_created';
  data: {
    listing?: unknown;
    transaction?: unknown;
    price?: number;
    sellerName?: string;
    buyerName?: string;
  };
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  requestId?: string;
  listingId?: string;
  content: string;
  type: 'text' | 'system' | 'status_update';
  timestamp: string;
  read: boolean;
}

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private eventCallbacks: Map<string, ((event: RealtimeEvent) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Subscribe to service requests
  subscribeToServiceRequests(callback: (request: ServiceRequest) => void) {
    const channelName = 'service_requests';
    
    if (this.channels.has(channelName)) {
      this.addCallback(channelName, callback);
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'service_requests' 
        }, 
        (payload: unknown) => {
          const event: RealtimeEvent = {
            type: 'service_request',
            data: payload,
            timestamp: new Date().toISOString(),
          };
          
          this.emit(channelName, event);
          // Type assertion for the payload
          const typedPayload = payload as { new?: ServiceRequest; old?: ServiceRequest };
          callback(typedPayload.new || typedPayload.old as ServiceRequest);
        }
      )
      .on('broadcast', 
        { event: 'request_update' }, 
        (payload: unknown) => {
          const event: RealtimeEvent = {
            type: 'request_update',
            data: payload,
            timestamp: new Date().toISOString(),
          };
          
          this.emit(channelName, event);
          callback(payload as ServiceRequest);
        }
      )
      .subscribe((status) => {
        console.log('Service requests subscription status:', status);
        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts = 0;
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName);
        }
      });

    this.channels.set(channelName, channel);
    this.addCallback(channelName, callback);
    
    return channel;
  }

  // Subscribe to collector status updates
  subscribeToCollectorStatus(callback: (status: CollectorStatus) => void) {
    const channelName = 'collector_status';
    
    if (this.channels.has(channelName)) {
      this.addCallback(channelName, callback);
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(channelName)
      .on('broadcast', 
        { event: 'status_update' }, 
        (payload) => {
          const event: RealtimeEvent = {
            type: 'collector_status',
            data: payload.payload,
            timestamp: new Date().toISOString(),
          };
          
          this.emit(channelName, event);
          callback(payload.payload as CollectorStatus);
        }
      )
      .subscribe((status) => {
        console.log('Collector status subscription status:', status);
        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts = 0;
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName);
        }
      });

    this.channels.set(channelName, channel);
    this.addCallback(channelName, callback);
    
    return channel;
  }

  // Subscribe to marketplace updates
  subscribeToMarketplace(callback: (update: MarketplaceUpdate) => void) {
    const channelName = 'marketplace';
    
    if (this.channels.has(channelName)) {
      this.addCallback(channelName, callback);
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'waste_listings' 
        }, 
        (payload) => {
          const update: MarketplaceUpdate = {
            id: payload.new?.id || payload.old?.id,
            type: payload.eventType === 'INSERT' ? 'listing_created' : 
                  payload.eventType === 'UPDATE' ? 'listing_updated' : 'listing_sold',
            data: { listing: payload.new || payload.old },
            timestamp: new Date().toISOString(),
          };
          
          this.emit(channelName, { type: 'marketplace_listing', data: update, timestamp: update.timestamp });
          callback(update);
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions' 
        }, 
        (payload) => {
          const update: MarketplaceUpdate = {
            id: payload.new?.id || payload.old?.id,
            type: 'transaction_created',
            data: { transaction: payload.new },
            timestamp: new Date().toISOString(),
          };
          
          this.emit(channelName, { type: 'transaction', data: update, timestamp: update.timestamp });
          callback(update);
        }
      )
      .subscribe((status) => {
        console.log('Marketplace subscription status:', status);
        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts = 0;
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName);
        }
      });

    this.channels.set(channelName, channel);
    this.addCallback(channelName, callback);
    
    return channel;
  }

  // Subscribe to messages
  subscribeToMessages(userId: string, callback: (message: Message) => void) {
    const channelName = `messages_${userId}`;
    
    if (this.channels.has(channelName)) {
      this.addCallback(channelName, callback);
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        }, 
        (payload) => {
          const event: RealtimeEvent = {
            type: 'message',
            data: payload.new,
            timestamp: new Date().toISOString(),
            userId,
          };
          
          this.emit(channelName, event);
          callback(payload.new as Message);
        }
      )
      .subscribe((status) => {
        console.log(`Messages subscription for ${userId} status:`, status);
        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts = 0;
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnect(channelName);
        }
      });

    this.channels.set(channelName, channel);
    this.addCallback(channelName, callback);
    
    return channel;
  }

  // Broadcast service request update
  broadcastRequestUpdate(request: ServiceRequest) {
    supabase
      .channel('service_requests')
      .send({
        type: 'broadcast',
        event: 'request_update',
        payload: request,
      });
  }

  // Broadcast collector status
  broadcastCollectorStatus(status: CollectorStatus) {
    supabase
      .channel('collector_status')
      .send({
        type: 'broadcast',
        event: 'status_update',
        payload: status,
      });
  }

  // Send message
  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>) {
    return supabase
      .from('messages')
      .insert({
        ...message,
        timestamp: new Date().toISOString(),
        read: false,
      })
      .select()
      .single();
  }

  // Get online collectors
  async getOnlineCollectors(): Promise<CollectorStatus[]> {
    const { data, error } = await supabase
      .from('collector_status')
      .select('*')
      .eq('is_online', true)
      .eq('is_available', true)
      .order('last_active_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Update collector status
  async updateCollectorStatus(collectorId: string, status: Partial<CollectorStatus>) {
    const { data, error } = await supabase
      .from('collector_status')
      .upsert({
        id: collectorId,
        ...status,
        last_active_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    // Broadcast the update
    this.broadcastCollectorStatus(data as CollectorStatus);
    return data;
  }

  // Private methods
  private addCallback(channelName: string, callback: (event: RealtimeEvent) => void) {
    if (!this.eventCallbacks.has(channelName)) {
      this.eventCallbacks.set(channelName, []);
    }
    this.eventCallbacks.get(channelName)!.push(callback);
  }

  private emit(channelName: string, event: RealtimeEvent) {
    const callbacks = this.eventCallbacks.get(channelName) || [];
    callbacks.forEach(callback => callback(event));
  }

  private handleReconnect(channelName: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect ${channelName} (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        const channel = this.channels.get(channelName);
        if (channel) {
          channel.subscribe();
        }
      }, 1000 * this.reconnectAttempts);
    } else {
      console.error(`Max reconnection attempts reached for ${channelName}`);
    }
  }

  // Unsubscribe from channel
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      this.eventCallbacks.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      this.unsubscribe(name);
    });
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
