import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { realtimeService, type ServiceRequest, type CollectorStatus } from "@/services/realtimeService";
import { Users, Plus, TrendingUp, Recycle, Leaf, Truck, MapPin, Phone, Star, Clock, CheckCircle, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { Group, WasteEntry, NAIROBI_CONSTITUENCIES } from "@/types/waste";

const Groups = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  
  // Real-time state
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [collectorStatus, setCollectorStatus] = useState<CollectorStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [isOnline, setIsOnline] = useState(false);
  
  const [groups, setGroups] = useLocalStorage<Group[]>("nairobiwaste-groups", []);
  const [wasteEntries, setWasteEntries] = useLocalStorage<WasteEntry[]>("nairobiwaste-entries", []);
  const [currentGroup, setCurrentGroup] = useLocalStorage<string | null>("nairobiwaste-currentgroup", null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  const [newGroup, setNewGroup] = useState<Omit<Group, 'id' | 'registeredAt'>>({
    name: "",
    constituency: "",
    contactPerson: "",
    phoneNumber: "",
  });

  const [newEntry, setNewEntry] = useState({
    plastic: 0,
    paper: 0,
    metal: 0,
    glass: 0,
    organic: 0,
    other: 0,
    notes: "",
  });

  const handleRegisterGroup = () => {
    if (!newGroup.name || !newGroup.constituency || !newGroup.contactPerson || !newGroup.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const group: Group = {
      id: Date.now().toString(),
      name: newGroup.name,
      constituency: newGroup.constituency,
      contactPerson: newGroup.contactPerson,
      phoneNumber: newGroup.phoneNumber,
      registeredAt: new Date().toISOString(),
    };

    setGroups([...groups, group]);
    setCurrentGroup(group.id);
    setIsRegisterOpen(false);
    setNewGroup({ name: "", constituency: "", contactPerson: "", phoneNumber: "" });
    setEditingGroupId(null);

    toast({
      title: "Group Registered! ",
      description: `${group.name} is now part of Nairobi's waste tracking initiative`,
    });
  };

  const handleEditGroup = (group: Group) => {
    setNewGroup({
      name: group.name,
      constituency: group.constituency,
      contactPerson: group.contactPerson,
      phoneNumber: group.phoneNumber,
    });
    setEditingGroupId(group.id);
    setIsRegisterOpen(true);
  };

  const handleUpdateGroup = (id: string, updates: Partial<Omit<Group, 'id' | 'registeredAt'>>) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, ...updates } : group
    ));
    setIsRegisterOpen(false);
    setEditingGroupId(null);
    setNewGroup({ name: "", constituency: "", contactPerson: "", phoneNumber: "" });
    toast({
      title: "Group Updated!",
      description: "Group information has been successfully updated.",
    });
  };

  const handleSubmitEntry = () => {
    if (!currentGroup) {
      toast({
        title: "No Group Selected",
        description: "Please register or select a group first",
        variant: "destructive",
      });
      return;
    }

    const entry: WasteEntry = {
      id: Date.now().toString(),
      groupId: currentGroup,
      date: new Date().toISOString(),
      ...newEntry,
    };

    setWasteEntries([...wasteEntries, entry]);
    setIsEntryOpen(false);
    setNewEntry({ plastic: 0, paper: 0, metal: 0, glass: 0, organic: 0, other: 0, notes: "" });

    const totalWeight = newEntry.plastic + newEntry.paper + newEntry.metal + 
      newEntry.glass + newEntry.organic + newEntry.other;

    toast({
      title: "Entry Recorded! ",
      description: `${totalWeight} kg of waste tracked for this week`,
    });
  };

  const selectedGroup = groups.find(g => g.id === currentGroup);
  const groupEntries = wasteEntries.filter(e => e.groupId === currentGroup);

  const calculateGroupStats = (groupId: string) => {
    const entries = wasteEntries.filter(e => e.groupId === groupId);
    const totalRecyclable = entries.reduce((sum, e) => sum + e.plastic + e.paper + e.metal + e.glass, 0);
    const totalCompostable = entries.reduce((sum, e) => sum + e.organic, 0);
    const totalOther = entries.reduce((sum, e) => sum + e.other, 0);
    return {
      recyclable: totalRecyclable,
      compostable: totalCompostable,
      totalDiverted: totalRecyclable + totalCompostable,
      total: totalRecyclable + totalCompostable + totalOther,
    };
  };

  const allStats = calculateGroupStats(currentGroup || "");

  // Real-time effects
  useEffect(() => {
    if (!user || !currentGroup) return;

    setConnectionStatus('connecting');

    // Subscribe to service requests
    const requestsChannel = realtimeService.subscribeToServiceRequests((request) => {
      setServiceRequests(prev => {
        const existing = prev.findIndex(r => r.id === request.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = request;
          return updated;
        }
        return [...prev, request];
      });

      // Show notification for new requests
      if (request.status === 'pending' && request.constituency === selectedGroup?.constituency) {
        toast({
          title: "New Service Request! 🚚",
          description: `${request.quantity}kg of ${request.wasteType} in ${request.constituency}`,
        });
      }
    });

    // Initialize collector status
    const initCollectorStatus = async () => {
      try {
        const status: CollectorStatus = {
          id: user.id,
          groupId: currentGroup,
          isOnline: false,
          isAvailable: false,
          lastActiveAt: new Date().toISOString(),
          specialization: ['plastic', 'organic', 'mixed'],
        };
        
        await realtimeService.updateCollectorStatus(user.id, status);
        setCollectorStatus(status);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Failed to initialize collector status:', error);
        setConnectionStatus('disconnected');
      }
    };

    initCollectorStatus();

    return () => {
      realtimeService.unsubscribe('service_requests');
    };
  }, [user, currentGroup, selectedGroup, toast]);

  // Handle online/offline toggle
  const toggleOnlineStatus = async () => {
    if (!user || !collectorStatus) return;

    const newStatus = !isOnline;
    setIsOnline(newStatus);

    try {
      await realtimeService.updateCollectorStatus(user.id, {
        ...collectorStatus,
        isOnline: newStatus,
        isAvailable: newStatus,
        lastActiveAt: new Date().toISOString(),
      });

      setCollectorStatus(prev => prev ? { ...prev, isOnline: newStatus, isAvailable: newStatus } : null);

      toast({
        title: newStatus ? "You're Online! 🟢" : "You're Offline 🔴",
        description: newStatus 
          ? "You'll now receive service requests from clients" 
          : "You won't receive new requests while offline",
      });
    } catch (error) {
      setIsOnline(!newStatus); // Revert on error
      toast({
        title: "Status Update Failed",
        description: "Unable to update your online status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle accepting a request
  const handleAcceptRequest = async (request: ServiceRequest) => {
    if (!user || !selectedGroup) return;

    try {
      const updatedRequest: ServiceRequest = {
        ...request,
        status: 'accepted',
        collectorId: user.id,
        collectorName: selectedGroup.name,
        collectorPhone: selectedGroup.phoneNumber,
        updatedAt: new Date().toISOString(),
      };

      // Broadcast the update
      realtimeService.broadcastRequestUpdate(updatedRequest);

      // Update local state
      setServiceRequests(prev => 
        prev.map(r => r.id === request.id ? updatedRequest : r)
      );

      toast({
        title: "Request Accepted! 🎉",
        description: `You've accepted the ${request.wasteType} collection request`,
      });
    } catch (error) {
      toast({
        title: "Failed to Accept Request",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Waste Collector Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Manage your waste collection operations and track your environmental impact
            </p>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus === 'connected' ? (
              <Badge className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : connectionStatus === 'connecting' ? (
              <Badge className="bg-yellow-100 text-yellow-800">
                <AlertCircle className="h-3 w-3 mr-1 animate-pulse" />
                Connecting...
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
            <Button
              onClick={toggleOnlineStatus}
              variant={isOnline ? "default" : "outline"}
              className={isOnline ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 mr-2" />
                  Go Online
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Real-time Service Requests */}
      {serviceRequests.length > 0 && (
        <Card className="p-6 mb-6 bg-gradient-to-br from-orange/10 to-orange/5 border-orange/20">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-bold">Live Service Requests</h2>
            <Badge variant="secondary">{serviceRequests.filter(r => r.status === 'pending').length} Pending</Badge>
          </div>
          
          <div className="space-y-3">
            {serviceRequests
              .filter(request => request.status === 'pending')
              .map((request) => (
                <Card key={request.id} className="p-4 border-l-4 border-orange-500 animate-pulse">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold capitalize">{request.wasteType} Collection</h4>
                      <p className="text-sm text-muted-foreground">{request.quantity}kg • {request.constituency}</p>
                      {request.location && <p className="text-sm text-muted-foreground">📍 {request.location}</p>}
                    </div>
                    <div className="text-right">
                      <Badge className="bg-orange-100 text-orange-800 mb-2">
                        {request.urgency.toUpperCase()}
                      </Badge>
                      <p className="text-sm font-bold text-primary">KES {request.estimatedPrice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.constituency}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAcceptRequest(request)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Request
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </Card>
      )}

      {/* Collector Profile - Only for authenticated collectors */}
      {user ? (
        <Card className="p-6 mb-6 bg-gradient-to-br from-green/10 to-green/5 border-green/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold">Collector Profile</h2>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          
          {selectedGroup ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Group Name</p>
                <p className="font-semibold">{selectedGroup.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Area</p>
                <p className="font-semibold">{selectedGroup.constituency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-semibold">{selectedGroup.contactPerson} • {selectedGroup.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specialization</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {collectorStatus?.specialization.map(spec => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                No collector group linked to your account
              </p>
              <Button onClick={() => setIsRegisterOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Register Your Group
              </Button>
            </div>
          )}
        </Card>
      ) : (
        // Non-authenticated users see collector registration prompt
        <Card className="p-6 mb-6 bg-gradient-to-br from-blue/10 to-blue/5 border-blue/20">
          <div className="text-center py-8">
            <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Join as a Waste Collector</h3>
            <p className="text-muted-foreground mb-6">
              Register your waste collection group to start receiving service requests from clients across Nairobi
            </p>
            <div className="space-y-3">
              <Button onClick={() => setIsRegisterOpen(true)} className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Register Your Group
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/auth'}>
                Sign In First
              </Button>
            </div>
          </div>
        </Card>
      )}

      {selectedGroup && (
        <>
          {/* Collector Performance Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="p-5 bg-gradient-to-br from-green/10 to-green/5">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </div>
              <p className="text-3xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground mt-1">collections</p>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-blue/10 to-blue/5">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-muted-foreground">Earnings Today</p>
              </div>
              <p className="text-3xl font-bold text-foreground">KES 8,450</p>
              <p className="text-xs text-muted-foreground mt-1">from collections</p>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-orange/10 to-orange/5">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-5 w-5 text-orange-600" />
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <p className="text-3xl font-bold text-foreground">4.8</p>
              <p className="text-xs text-muted-foreground mt-1">from 127 reviews</p>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-purple/10 to-purple/5">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
              <p className="text-3xl font-bold text-foreground">8 min</p>
              <p className="text-xs text-muted-foreground mt-1">average</p>
            </Card>
          </div>

          {/* Active Service Requests */}
          {serviceRequests.length > 0 && (
            <Card className="p-6 mb-6 bg-gradient-to-br from-orange/10 to-orange/5 border-orange/20">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-bold">Active Requests</h2>
                <Badge variant="secondary">{serviceRequests.filter(r => r.status === 'pending').length} Pending</Badge>
              </div>
              
              <div className="space-y-3">
                {serviceRequests
                  .filter(request => request.status === 'pending')
                  .map((request) => (
                    <Card key={request.id} className="p-4 border-l-4 border-orange-500 animate-pulse">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold capitalize">{request.wasteType} Collection</h4>
                          <p className="text-sm text-muted-foreground">{request.quantity}kg • {request.constituency}</p>
                          {request.location && <p className="text-sm text-muted-foreground"> {request.location}</p>}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-orange-100 text-orange-800 mb-2">
                            {request.urgency.toUpperCase()}
                          </Badge>
                          <p className="text-sm font-bold text-primary">KES {request.estimatedPrice}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.constituency}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptRequest(request)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Request
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Recent Activity</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Completed plastic collection</p>
                  <p className="text-sm text-muted-foreground">Westlands • 2 hours ago • KES 1,250</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Completed organic waste collection</p>
                  <p className="text-sm text-muted-foreground">Karen • 4 hours ago • KES 750</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500" />
                <div className="flex-1">
                  <p className="font-medium">Received 5-star rating</p>
                  <p className="text-sm text-muted-foreground">From Sarah M. • 6 hours ago</p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Groups;
