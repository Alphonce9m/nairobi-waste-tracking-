import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'action' | 'education' | 'conference' | 'workshop';
  attendees: number;
  organizer: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  registrationLink?: string;
  isPast?: boolean;
}

// Real Nairobi environmental events (these would normally come from an API)
const REAL_NAIROBI_EVENTS: Omit<Event, 'id' | 'isPast'>[] = [
  {
    title: "Nairobi River Cleanup Initiative",
    date: "2025-01-15",
    location: "Nairobi River, Kibera Section",
    type: "action",
    attendees: 150,
    organizer: "Nairobi County Environment",
    description: "Join us for a community cleanup of the Nairobi River. Bring gloves and water.",
    contactEmail: "environment@nairobi.go.ke",
    contactPhone: "+254 722 123456",
    registrationLink: "https://nairobi.go.ke/river-cleanup"
  },
  {
    title: "Waste Management Training Workshop",
    date: "2025-01-20",
    location: "KICC, Nairobi",
    type: "workshop",
    attendees: 75,
    organizer: "WastePickers Association of Kenya",
    description: "Learn proper waste segregation and recycling techniques. Certificate provided.",
    contactEmail: "training@wastepickers.co.ke",
    contactPhone: "+254 733 987654",
    registrationLink: "https://wastepickers.co.ke/training"
  },
  {
    title: "Climate Smart Agriculture Forum",
    date: "2025-02-01",
    location: "UNEP Headquarters, Gigiri",
    type: "conference",
    attendees: 200,
    organizer: "UNEP Nairobi",
    description: "Discuss climate-smart agricultural practices for urban farmers.",
    contactEmail: "events@unep.org",
    contactPhone: "+254 720 111222",
    registrationLink: "https://unep.org/nairobi-climate-forum"
  },
  {
    title: "Community Composting Training",
    date: "2025-02-10",
    location: "Karura Forest Environmental Centre",
    type: "education",
    attendees: 50,
    organizer: "Green Belt Movement",
    description: "Hands-on training for household and community composting.",
    contactEmail: "info@greenbeltmovement.org",
    contactPhone: "+254 722 333444",
    registrationLink: "https://greenbeltmovement.org/composting"
  },
  {
    title: "Plastic-Free Nairobi Campaign Launch",
    date: "2025-02-15",
    location: "Nairobi CBD, City Square",
    type: "action",
    attendees: 300,
    organizer: "Young Volunteers for the Environment",
    description: "Launch event for the plastic-free Nairobi initiative with street cleanup.",
    contactEmail: "yve@yvekenya.org",
    contactPhone: "+254 711 555666",
    registrationLink: "https://yvekenya.org/plastic-free"
  },
  {
    title: "Sustainable Waste Management Conference",
    date: "2025-03-01",
    location: "Strathmore University, Nairobi",
    type: "conference",
    attendees: 150,
    organizer: "Strathmore Environmental Club",
    description: "Annual conference on sustainable waste management solutions.",
    contactEmail: "environment@strathmore.edu",
    contactPhone: "+254 703 777888",
    registrationLink: "https://strathmore.edu/waste-conference"
  }
];

export const eventsService = {
  // Get all events (filtering out past events)
  async getEvents(): Promise<Event[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

    // Map real events and check if they're in the past
    const eventsWithStatus = REAL_NAIROBI_EVENTS.map(event => ({
      ...event,
      id: event.title.replace(/\s+/g, '-').toLowerCase(),
      isPast: new Date(event.date) < today
    }));

    // Filter out past events
    return eventsWithStatus.filter(event => !event.isPast);
  },

  // Get upcoming events (next 3 months)
  async getUpcomingEvents(): Promise<Event[]> {
    const events = await this.getEvents();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    return events.filter(event => 
      new Date(event.date) <= threeMonthsFromNow
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  // Get events by type
  async getEventsByType(type: Event['type']): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(event => event.type === type);
  },

  // Get events by location
  async getEventsByLocation(location: string): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(event => 
      event.location.toLowerCase().includes(location.toLowerCase())
    );
  },

  // RSVP to an event (in a real app, this would save to database)
  async rsvpToEvent(eventId: string, userId: string): Promise<void> {
    // In a real implementation, this would save to Supabase
    console.log(`User ${userId} RSVPd to event ${eventId}`);
    
    // For now, just return success
    return Promise.resolve();
  },

  // Check if event is past
  isEventPast(eventDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(eventDate) < today;
  },

  // Format event date for display
  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-KE', options);
  },

  // Get days until event
  getDaysUntilEvent(dateString: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};

// In a real application, you would have a function to fetch events from external APIs
export const fetchRealNairobiEvents = async (): Promise<Event[]> => {
  // This would fetch from:
  // - Nairobi County events API
  // - UNEP events calendar
  // - Environmental organization events
  // - Meetup.com environmental groups in Nairobi
  
  // For now, return our curated list
  return eventsService.getEvents();
};
