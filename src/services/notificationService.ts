import { createClient } from '@/utils/supabase/client';

export interface CollectionNotification {
  id: string;
  type: 'collection_request';
  title: string;
  message: string;
  location: string;
  wasteType: string;
  quantity: string;
  requesterName: string;
  requesterPhone: string;
  createdAt: string;
  read: boolean;
}

class NotificationService {
  private subscription: any = null;

  // Subscribe to collection requests for sellers
  subscribeToCollectionRequests(callback: (notification: CollectionNotification) => void) {
    const supabase = createClient();
    
    // Listen to new collection requests
    this.subscription = supabase
      .channel('collection_requests')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'collection_requests' },
        (payload: any) => {
          const newRequest = payload.new;
          const notification: CollectionNotification = {
            id: newRequest.id,
            type: 'collection_request',
            title: 'New Waste Collection Request',
            message: `${newRequest.quantity}kg of ${newRequest.waste_type} needs collection`,
            location: newRequest.location,
            wasteType: newRequest.waste_type,
            quantity: newRequest.quantity,
            requesterName: newRequest.requester_name || 'Anonymous',
            requesterPhone: newRequest.phone || 'Not provided',
            createdAt: newRequest.created_at,
            read: false,
          };
          callback(notification);
        }
      )
      .subscribe();
  }

  // Unsubscribe from notifications
  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // Mock: Simulate a collection request (for testing)
  simulateCollectionRequest() {
    const notification: CollectionNotification = {
      id: `sim-${Date.now()}`,
      type: 'collection_request',
      title: 'New Waste Collection Request',
      message: '50kg of plastic needs collection',
      location: 'Kibera, Nairobi',
      wasteType: 'plastic',
      quantity: '50',
      requesterName: 'John Doe',
      requesterPhone: '+254712345678',
      createdAt: new Date().toISOString(),
      read: false,
    };
    return notification;
  }
}

export const notificationService = new NotificationService();
