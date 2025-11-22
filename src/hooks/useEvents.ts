import { useState, useEffect, useCallback } from 'react';
import { eventsService, Event } from '@/services/eventsService';
import { eventScheduler } from '@/utils/eventScheduler';
import { useToast } from '@/hooks/use-toast';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const upcomingEvents = await eventsService.getUpcomingEvents();
      setEvents(upcomingEvents);
      
      // Check for events that are about to expire
      const expiringSoon = await eventScheduler.getExpiringSoonEvents();
      if (expiringSoon.length > 0) {
        toast({
          title: "Events Ending Soon",
          description: `${expiringSoon.length} event(s) ending in the next week`,
          variant: "default",
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // RSVP to event
  const rsvpToEvent = useCallback(async (eventId: string, userId: string) => {
    try {
      await eventsService.rsvpToEvent(eventId, userId);
      
      // Update local state to show RSVP
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, attendees: event.attendees + 1 }
            : event
        )
      );
      
      toast({
        title: "RSVP Successful!",
        description: "You're registered for this event",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'RSVP failed';
      toast({
        title: "RSVP Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Cancel RSVP
  const cancelRsvp = useCallback(async (eventId: string, userId: string) => {
    try {
      // In a real app, this would call an API to cancel RSVP
      // For now, we'll just update the local state
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, attendees: Math.max(0, event.attendees - 1) }
            : event
        )
      );
      
      toast({
        title: "RSVP Cancelled",
        description: "You've cancelled your RSVP",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel RSVP';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Refresh events manually
  const refreshEvents = useCallback(async () => {
    await eventScheduler.refreshEvents();
    await fetchEvents();
  }, [fetchEvents]);

  // Get events by type
  const getEventsByType = useCallback((type: Event['type']) => {
    return events.filter(event => event.type === type);
  }, [events]);

  // Get events happening today
  const getTodayEvents = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  }, [events]);

  // Get events happening this week
  const getThisWeekEvents = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= weekFromNow;
    });
  }, [events]);

  // Initialize on mount
  useEffect(() => {
    fetchEvents();

    // Set up automatic refresh every 30 minutes
    const interval = setInterval(() => {
      fetchEvents();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    rsvpToEvent,
    cancelRsvp,
    refreshEvents,
    getEventsByType,
    getTodayEvents,
    getThisWeekEvents,
  };
};
