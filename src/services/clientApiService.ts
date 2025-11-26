import { realtimeService } from './realtimeService';

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
  status: 'pending' | 'matched' | 'accepted' | 'en_route' | 'collecting' | 'completed' | 'cancelled';
  createdAt: string;
  matchedCollectorId?: string;
  matchedCollectorName?: string;
  collectorPhone?: string;
  collectorRating?: number;
  eta?: string;
  estimatedTime?: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  defaultLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  preferences: {
    wasteTypes: string[];
    preferredUrgency: string;
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

class ClientApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Service Request Management
  async submitServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>): Promise<ServiceRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const request = await response.json();
      
      // Broadcast to real-time service for immediate updates
      await realtimeService.broadcastRequestUpdate(request);
      
      return request;
    } catch (error) {
      console.error('Error submitting service request:', error);
      throw error;
    }
  }

  async getClientRequests(clientId: string): Promise<ServiceRequest[]> {
    try {
      const response = await fetch(`${this.baseUrl}/requests/client/${clientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client requests:', error);
      throw error;
    }
  }

  async updateRequestStatus(requestId: string, status: ServiceRequest['status'], updates?: Partial<ServiceRequest>): Promise<ServiceRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, ...updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedRequest = await response.json();
      
      // Broadcast the update
      await realtimeService.broadcastRequestUpdate(updatedRequest);
      
      return updatedRequest;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }

  async cancelRequest(requestId: string, reason?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/requests/${requestId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local status
      await this.updateRequestStatus(requestId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling request:', error);
      throw error;
    }
  }

  // Client Profile Management
  async getClientProfile(clientId: string): Promise<ClientProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/clients/${clientId}`);
      
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client profile:', error);
      throw error;
    }
  }

  async updateClientProfile(clientId: string, updates: Partial<ClientProfile>): Promise<ClientProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/clients/${clientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating client profile:', error);
      throw error;
    }
  }

  async createClientProfile(profileData: Omit<ClientProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating client profile:', error);
      throw error;
    }
  }

  // Pricing and Estimation
  async getEstimatedPrice(wasteType: string, quantity: number, urgency: string, location: string): Promise<{
    estimatedPrice: number;
    estimatedTime: number;
    availableCollectors: number;
    surgeMultiplier: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/pricing/estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wasteType,
          quantity,
          urgency,
          location,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting price estimate:', error);
      throw error;
    }
  }

  // Rating and Feedback
  async rateCollector(requestId: string, rating: number, feedback?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/requests/${requestId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, feedback }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error rating collector:', error);
      throw error;
    }
  }

  // Notifications
  async subscribeToNotifications(clientId: string, deviceToken?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, deviceToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      throw error;
    }
  }

  async unsubscribeFromNotifications(clientId: string, deviceToken?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientId, deviceToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      throw error;
    }
  }

  // Location Services
  async geocodeLocation(address: string): Promise<{ lat: number; lng: number; formattedAddress: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/location/geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error geocoding location:', error);
      throw error;
    }
  }

  async getNearbyCollectors(lat: number, lng: number, wasteType?: string): Promise<{
    id: string;
    name: string;
    rating: number;
    distance: number;
    estimatedTime: number;
    phone: string;
  }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/collectors/nearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lng, wasteType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching nearby collectors:', error);
      throw error;
    }
  }

  // Analytics and Insights
  async getClientAnalytics(clientId: string): Promise<{
    totalRequests: number;
    completedRequests: number;
    totalSpent: number;
    averageRating: number;
    favoriteWasteType: string;
    preferredUrgency: string;
    monthlyStats: {
      month: string;
      requests: number;
      spent: number;
    }[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/client/${clientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client analytics:', error);
      throw error;
    }
  }
}

export const clientApiService = new ClientApiService();
