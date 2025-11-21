import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, BookOpen, ExternalLink, Search, MapPin, Heart } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  attendees: number;
}

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

const events: Event[] = [
  {
    id: "1",
    title: "Community Tree Planting Day",
    date: "2025-12-05",
    location: "Central Park",
    type: "Action",
    attendees: 127,
  },
  {
    id: "2",
    title: "Climate Science Workshop",
    date: "2025-12-10",
    location: "Science Museum",
    type: "Education",
    attendees: 45,
  },
  {
    id: "3",
    title: "Youth Climate Summit",
    date: "2025-12-15",
    location: "City Hall",
    type: "Conference",
    attendees: 230,
  },
  {
    id: "4",
    title: "Beach Cleanup Initiative",
    date: "2025-12-20",
    location: "Ocean Beach",
    type: "Action",
    attendees: 89,
  },
];

const organizations: Organization[] = [
  {
    id: "1",
    name: "Climate Action Network",
    description: "Global network of climate organizations working on policy advocacy and grassroots mobilization",
    focus: "Policy & Advocacy",
    website: "https://climatenetwork.org",
    impact: "1,300+ member organizations in 130+ countries",
  },
  {
    id: "2",
    name: "350.org",
    description: "Building a global climate movement with grassroots organizing and mass public actions",
    focus: "Grassroots Organizing",
    website: "https://350.org",
    impact: "Led campaigns in 188 countries",
  },
  {
    id: "3",
    name: "The Climate Reality Project",
    description: "Training climate leaders and mobilizing communities for climate solutions",
    focus: "Education & Training",
    website: "https://climaterealityproject.org",
    impact: "40,000+ trained Climate Reality Leaders",
  },
  {
    id: "4",
    name: "Sunrise Movement",
    description: "Youth-led movement fighting for climate justice and good jobs",
    focus: "Youth Activism",
    website: "https://sunrisemovement.org",
    impact: "600+ local hubs across the US",
  },
];

const resources: Resource[] = [
  {
    id: "1",
    title: "IPCC Climate Reports",
    type: "Research",
    description: "Comprehensive scientific assessments on climate change from the UN",
    link: "https://ipcc.ch/reports",
    author: "IPCC",
  },
  {
    id: "2",
    title: "Project Drawdown",
    type: "Solutions",
    description: "Comprehensive resource on climate solutions ranked by impact",
    link: "https://drawdown.org",
    author: "Project Drawdown",
  },
  {
    id: "3",
    title: "Climate Justice Toolkit",
    type: "Guide",
    description: "Resources for integrating equity and justice into climate action",
    link: "https://example.com/toolkit",
    author: "Climate Justice Alliance",
  },
  {
    id: "4",
    title: "NASA Climate Data",
    type: "Data",
    description: "Real-time climate data, visualizations, and educational resources",
    link: "https://climate.nasa.gov",
    author: "NASA",
  },
];

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);

  const handleRSVP = (eventId: string) => {
    if (rsvpEvents.includes(eventId)) {
      setRsvpEvents(rsvpEvents.filter((id) => id !== eventId));
    } else {
      setRsvpEvents([...rsvpEvents, eventId]);
    }
  };

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
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
            </div>
            <p className="text-muted-foreground">
              Join local climate action events and meetups
            </p>
          </Card>

          {events.map((event) => {
            const isRSVPed = rsvpEvents.includes(event.id);
            const eventDate = new Date(event.date);

            return (
              <Card key={event.id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {eventDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{event.type}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendees + (isRSVPed ? 1 : 0)} attending
                    </span>
                  </div>
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
              </Card>
            );
          })}
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
