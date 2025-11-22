import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { useEvents } from "@/hooks/useEvents";
import { Users, Calendar, BookOpen, ExternalLink, Search, MapPin, Heart, Clock, Phone, Mail, User, RefreshCw } from "lucide-react";
import { Event } from "@/services/eventsService";

interface Organization {
  id: string;
  name: string;
  description: string;
  focus: string;
  website: string;
  impact: string;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  description: string;
  link: string;
  author: string;
}

const Community = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);
  
  // Use the events hook
  const { 
    events, 
    loading, 
    error, 
    rsvpToEvent, 
    cancelRsvp, 
    refreshEvents,
    getTodayEvents,
    getThisWeekEvents 
  } = useEvents();

  const handleRSVP = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to RSVP for events",
        variant: "destructive",
      });
      return;
    }

    try {
      if (rsvpEvents.includes(eventId)) {
        await cancelRsvp(eventId, user.id);
        setRsvpEvents(rsvpEvents.filter((id) => id !== eventId));
      } else {
        await rsvpToEvent(eventId, user.id);
        setRsvpEvents([...rsvpEvents, eventId]);
      }
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const organizations = [
    {
      id: "1",
      name: "Nairobi County Environment Management",
      description: "County government department responsible for environmental policy and waste management in Nairobi",
      focus: "Policy & Regulation",
      website: "https://nairobi.go.ke/environment",
      impact: "Over 4 million residents served across Nairobi",
    },
    {
      id: "2",
      name: "WastePickers Association of Kenya",
      description: "Empowering waste pickers through training, advocacy, and fair trade practices",
      focus: "Waste Management",
      website: "https://wastepickers.co.ke",
      impact: "15,000+ waste pickers supported across Kenya",
    },
    {
      id: "3",
      name: "Young Volunteers for the Environment (YVE)",
      description: "Youth-led environmental organization focusing on clean-ups and environmental education",
      focus: "Youth Activism",
      website: "https://yvekenya.org",
      impact: "50,000+ youth engaged in environmental activities",
    },
    {
      id: "4",
      name: "Green Belt Movement",
      description: "Environmental organization founded by Wangari Maathai focusing on tree planting and conservation",
      focus: "Conservation",
      website: "https://greenbeltmovement.org",
      impact: "51 million trees planted across Kenya",
    },
    {
      id: "5",
      name: "Nairobi Recyclers Association",
      description: "Professional association for recycling businesses and informal sector recyclers",
      focus: "Recycling",
      website: "https://nairobirecyclers.org",
      impact: "200+ registered recycling businesses",
    },
    {
      id: "6",
      name: "Umande Trust",
      description: "Focus on water, sanitation, and environmental management in urban informal settlements",
      focus: "Water & Sanitation",
      website: "https://umande.org",
      impact: "150+ bio-centers built in informal settlements",
    },
  ];

  const resources = [
    {
      id: "1",
      title: "Nairobi County Waste Management Policy",
      type: "Policy",
      description: "Official county policy on waste management and environmental protection",
      link: "https://nairobi.go.ke/waste-policy",
      author: "Nairobi County Government",
    },
    {
      id: "2",
      title: "Waste Segregation Guide for Nairobi",
      type: "Guide",
      description: "Practical guide on how to segregate waste at household level in Nairobi",
      link: "https://nairobirecyclers.org/segregation-guide",
      author: "Nairobi Recyclers Association",
    },
    {
      id: "3",
      title: "Dandora Dumpsite Rehabilitation Report",
      type: "Research",
      description: "Comprehensive study on Dandora dumpsite impact and rehabilitation strategies",
      link: "https://unep.org/dandora-report",
      author: "UNEP Nairobi",
    },
    {
      id: "4",
      title: "Composting Training Manual",
      type: "Manual",
      description: "Step-by-step guide for community composting in urban areas",
      link: "https://greenbeltmovement.org/composting",
      author: "Green Belt Movement",
    },
    {
      id: "5",
      title: "Nairobi Climate Action Plan",
      type: "Plan",
      description: "Nairobi's climate action plan and adaptation strategies",
      link: "https://nairobi.go.ke/climate-action",
      author: "Nairobi County Government",
    },
  ];

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.focus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">Community</h1>
        <p className="text-muted-foreground text-lg">
          Connect, learn, and take action together
        </p>
      </header>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="organizations">
            <Users className="h-4 w-4 mr-2" />
            NGOs
          </TabsTrigger>
          <TabsTrigger value="resources">
            <BookOpen className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Upcoming Environmental Events</h2>
              </div>
              <Button variant="outline" size="sm" onClick={refreshEvents} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <p className="text-muted-foreground">
              Real environmental events happening in Nairobi. Events are automatically updated and outdated events are removed.
            </p>
            {error && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">Error loading events: {error}</p>
              </div>
            )}
          </Card>

          {loading ? (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 animate-pulse text-muted-foreground mx-auto mb-2" />
              <p>Loading upcoming events...</p>
            </div>
          ) : events.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">Check back soon for new environmental events in Nairobi</p>
            </Card>
          ) : (
            <>
              {/* Quick stats */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{events.length}</div>
                  <div className="text-sm text-muted-foreground">Total Events</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">{getTodayEvents().length}</div>
                  <div className="text-sm text-muted-foreground">Today</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">{getThisWeekEvents().length}</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </Card>
              </div>

              {/* Events list */}
              {events.map((event) => {
                const isRSVPed = rsvpEvents.includes(event.id);
                const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
                const eventDate = new Date(event.date).toLocaleDateString('en-KE', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });

                return (
                  <Card key={event.id} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {eventDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {event.organizer}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 text-sm">
                          {event.contactEmail && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {event.contactEmail}
                            </span>
                          )}
                          {event.contactPhone && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {event.contactPhone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary">{event.type}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.attendees + (isRSVPed ? 1 : 0)} attending
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {event.registrationLink && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              Register
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant={isRSVPed ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRSVP(event.id)}
                        >
                          {isRSVPed ? (
                            <>
                              <Heart className="h-4 w-4 mr-1 fill-current" />
                              RSVP'd
                            </>
                          ) : (
                            "RSVP"
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </TabsContent>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold text-foreground">Climate Organizations</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {filteredOrganizations.map((org) => (
            <Card key={org.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {org.name}
                  </h3>
                  <Badge variant="secondary" className="mb-3">
                    {org.focus}
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-3">
                    {org.description}
                  </p>
                  <div className="bg-primary/10 p-3 rounded-lg mb-3">
                    <p className="text-sm font-medium text-foreground">
                      Impact: {org.impact}
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </Card>
          ))}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Learning Resources</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {filteredResources.map((resource) => (
            <Card key={resource.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {resource.title}
                    </h3>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {resource.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    By {resource.author}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Access Resource
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
