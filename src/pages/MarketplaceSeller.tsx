import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Package, DollarSign, Scale, Plus, Bell, X, Phone, MapPin } from "lucide-react";
import { notificationService, CollectionNotification } from "@/services/notificationService";

interface SellerListing {
  id: string;
  wasteType: "plastic" | "organic" | "electronic" | "hazardous" | "mixed";
  quantity: number;
  pricePerKg: number;
  status: "available" | "reserved" | "sold" | "expired";
  location: string;
  createdAt: string;
}

interface SellerTransaction {
  id: string;
  listingId: string;
  buyerName: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled" | "disputed";
  createdAt: string;
}

const MarketplaceSeller = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [transactions, setTransactions] = useState<SellerTransaction[]>([]);
  const [notifications, setNotifications] = useState<CollectionNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newListing, setNewListing] = useState({
    wasteType: "",
    quantity: "",
    pricePerKg: "",
    location: "",
  });

  useEffect(() => {
    // Subscribe to collection requests
    notificationService.subscribeToCollectionRequests((notification) => {
      setNotifications(prev => [notification, ...prev]);
      toast({
        title: notification.title,
        description: notification.message,
      });
    });

    // Mock: Simulate a collection request after 5 seconds (for demo)
    const timer = setTimeout(() => {
      const mockNotification = notificationService.simulateCollectionRequest();
      setNotifications(prev => [mockNotification, ...prev]);
      toast({
        title: mockNotification.title,
        description: mockNotification.message,
      });
    }, 5000);

    return () => {
      notificationService.unsubscribe();
      clearTimeout(timer);
    };
  }, [toast]);

  useEffect(() => {
    // Mock initial data – later this can come from Supabase using sellerId
    const mockListings: SellerListing[] = [
      {
        id: "s-1",
        wasteType: "plastic",
        quantity: 120,
        pricePerKg: 30,
        status: "available",
        location: "Kibera, Nairobi",
        createdAt: new Date().toISOString(),
      },
      {
        id: "s-2",
        wasteType: "organic",
        quantity: 80,
        pricePerKg: 18,
        status: "sold",
        location: "Dandora, Nairobi",
        createdAt: new Date().toISOString(),
      },
    ];

    const mockTransactions: SellerTransaction[] = [
      {
        id: "tx-s-1",
        listingId: "s-2",
        buyerName: "Green Recyclers Ltd",
        quantity: 80,
        totalPrice: 80 * 18,
        status: "completed",
        createdAt: new Date().toISOString(),
      },
    ];

    setListings(mockListings);
    setTransactions(mockTransactions);
  }, []);

  const handleCreateListing = () => {
    const listing: SellerListing = {
      id: `seller-${Date.now()}`,
      wasteType: newListing.wasteType as SellerListing["wasteType"],
      quantity: parseFloat(newListing.quantity),
      pricePerKg: parseFloat(newListing.pricePerKg),
      status: "available",
      location: newListing.location,
      createdAt: new Date().toISOString(),
    };

    setListings((prev) => [listing, ...prev]);
    setNewListing({ wasteType: "", quantity: "", pricePerKg: "", location: "" });

    toast({
      title: "Listing created",
      description: "Your waste listing is now visible to buyers (demo mode)",
    });
  };

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const totalKgSold = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            SELLER ONLY: Manage your own waste listings and track your sales. Buyers cannot see this page.
          </p>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>

          {showNotifications && (
            <Card className="absolute right-0 top-12 w-80 p-4 z-10 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Collection Requests</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-muted-foreground text-sm">No new requests</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <Card key={notif.id} className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">{notif.wasteType}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notif.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-1">{notif.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {notif.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {notif.requesterPhone}
                      </div>
                      <div className="mt-2">
                        <Button size="sm" className="w-full">
                          Accept Request
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="sales">My Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue (demo)</p>
                <p className="text-xl font-bold">KES {totalRevenue}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <Scale className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Kg Sold</p>
                <p className="text-xl font-bold">{totalKgSold} kg</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <Package className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="text-xs text-muted-foreground">Active Listings</p>
                <p className="text-xl font-bold">{listings.filter((l) => l.status === "available").length}</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="listings">
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">Create New Listing (demo)</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>Waste Type</Label>
                <Input
                  placeholder="plastic / organic / ..."
                  value={newListing.wasteType}
                  onChange={(e) => setNewListing({ ...newListing, wasteType: e.target.value })}
                />
              </div>
              <div>
                <Label>Quantity (kg)</Label>
                <Input
                  type="number"
                  value={newListing.quantity}
                  onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                />
              </div>
              <div>
                <Label>Price per kg (KES)</Label>
                <Input
                  type="number"
                  value={newListing.pricePerKg}
                  onChange={(e) => setNewListing({ ...newListing, pricePerKg: e.target.value })}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={handleCreateListing} disabled={!newListing.wasteType || !newListing.quantity || !newListing.pricePerKg || !newListing.location}>
              Save Listing (demo)
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">My Listings</h2>
            {listings.length === 0 ? (
              <p className="text-muted-foreground">No listings yet.</p>
            ) : (
              <div className="space-y-3">
                {listings.map((listing) => (
                  <Card key={listing.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold capitalize">{listing.wasteType} waste</p>
                      <p className="text-sm text-muted-foreground">
                        {listing.quantity} kg · KES {listing.pricePerKg}/kg · {listing.location}
                      </p>
                    </div>
                    <Badge>{listing.status}</Badge>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">My Sales</h2>
            </div>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground">No sales yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <Card key={tx.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{tx.buyerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.quantity} kg · KES {tx.totalPrice} · {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={tx.status === "completed" ? "default" : "secondary"}>{tx.status}</Badge>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceSeller;
