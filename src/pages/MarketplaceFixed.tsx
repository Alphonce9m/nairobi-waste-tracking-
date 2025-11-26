import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Filter, 
  Package, 
  MapPin, 
  Calendar, 
  Clock,
  TrendingUp,
  DollarSign,
  Scale
} from "lucide-react";

// Mock types - no external dependencies
interface WasteListing {
  id: string;
  sellerId: string;
  wasteType: 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed';
  quantity: number;
  pricePerKg: number;
  availableFrom: string;
  availableUntil: string;
  status: 'available' | 'reserved' | 'sold' | 'expired';
  location: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const MarketplaceFixed = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [filtered, setFiltered] = useState<WasteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    wasteType: '',
    minPrice: '',
    maxPrice: '',
  });

  const [newListing, setNewListing] = useState({
    wasteType: '',
    quantity: '',
    pricePerKg: '',
    availableFrom: '',
    availableUntil: '',
    location: '',
    description: '',
  });

  // Initialize with mock data
  useEffect(() => {
    const mockListings: WasteListing[] = [
      {
        id: '1',
        sellerId: 'seller-1',
        wasteType: 'plastic',
        quantity: 100,
        pricePerKg: 25,
        location: 'Kilimani, Nairobi',
        description: 'Clean plastic bottles and containers - PET, HDPE, PP plastics',
        status: 'available',
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        sellerId: 'seller-2',
        wasteType: 'organic',
        quantity: 50,
        pricePerKg: 15,
        location: 'Westlands, Nairobi',
        description: 'Food waste, vegetable scraps, and organic materials',
        status: 'available',
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        sellerId: 'seller-3',
        wasteType: 'electronic',
        quantity: 25,
        pricePerKg: 50,
        location: 'Industrial Area, Nairobi',
        description: 'Electronic waste - computers, phones, and electronic components',
        status: 'available',
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        sellerId: 'seller-4',
        wasteType: 'hazardous',
        quantity: 10,
        pricePerKg: 100,
        location: 'Kasarani, Nairobi',
        description: 'Batteries, chemicals, and hazardous electronic waste',
        status: 'available',
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        sellerId: 'seller-5',
        wasteType: 'mixed',
        quantity: 75,
        pricePerKg: 20,
        location: 'Eastlands, Nairobi',
        description: 'Mixed recyclable materials - paper, plastic, and metal',
        status: 'available',
        availableFrom: new Date().toISOString(),
        availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    setTimeout(() => {
      setListings(mockListings);
      setFiltered(mockListings);
      setLoading(false);
      
      toast({
        title: "🎉 Marketplace Loaded!",
        description: `Found ${mockListings.length} waste listings available`,
      });
    }, 1000);
  }, [toast]);

  useEffect(() => {
    let filteredListings = listings;
    
    if (filters.wasteType) {
      filteredListings = filteredListings.filter(listing => listing.wasteType === filters.wasteType);
    }
    
    if (filters.minPrice) {
      filteredListings = filteredListings.filter(listing => listing.pricePerKg >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filteredListings = filteredListings.filter(listing => listing.pricePerKg <= parseFloat(filters.maxPrice));
    }
    
    setFiltered(filteredListings);
  }, [listings, filters]);

  const handleCreateListing = () => {
    const mockListing: WasteListing = {
      id: `mock-${Date.now()}`,
      sellerId: 'current-user',
      wasteType: newListing.wasteType as 'plastic' | 'organic' | 'electronic' | 'hazardous' | 'mixed',
      quantity: parseFloat(newListing.quantity),
      pricePerKg: parseFloat(newListing.pricePerKg),
      location: newListing.location,
      description: newListing.description,
      status: 'available',
      availableFrom: newListing.availableFrom,
      availableUntil: newListing.availableUntil,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setListings(prev => [mockListing, ...prev]);
    setNewListing({
      wasteType: '',
      quantity: '',
      pricePerKg: '',
      availableFrom: '',
      availableUntil: '',
      location: '',
      description: '',
    });

    toast({
      title: "✅ Listing Created!",
      description: `Your ${mockListing.wasteType} listing is now available`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case 'plastic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'organic': return 'bg-green-100 text-green-800 border-green-200';
      case 'electronic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hazardous': return 'bg-red-100 text-red-800 border-red-200';
      case 'mixed': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Package className="h-8 w-8 text-green-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Nairobi Waste Marketplace
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          🌍 Buy and sell recyclable materials across Nairobi
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Badge className="bg-green-100 text-green-800">
            📦 {listings.length} Active Listings
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            🔄 Real-time Updates
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white shadow-lg">
          <TabsTrigger value="browse" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            🛍️ Browse
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            ➕ Create
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            💰 Transactions
          </TabsTrigger>
        </TabsList>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card className="p-6 shadow-xl border-0 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">🔍 Search & Filter</h3>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Waste Type</Label>
                <Select value={filters.wasteType} onValueChange={(value) => setFilters({...filters, wasteType: value})}>
                  <SelectTrigger className="border-green-200 focus:border-green-400">
                    <SelectValue placeholder="📦 All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">📦 All types</SelectItem>
                    <SelectItem value="plastic">♻️ Plastic</SelectItem>
                    <SelectItem value="organic">🌱 Organic</SelectItem>
                    <SelectItem value="electronic">📱 Electronic</SelectItem>
                    <SelectItem value="hazardous">⚠️ Hazardous</SelectItem>
                    <SelectItem value="mixed">🔄 Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Min Price (KES/kg)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Max Price (KES/kg)</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ wasteType: '', minPrice: '', maxPrice: '' })}
                  className="border-green-200 hover:bg-green-50"
                >
                  🔄 Clear
                </Button>
              </div>
            </div>
          </Card>

          {/* Listings */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading amazing waste listings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No listings found</p>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((listing) => (
                <Card key={listing.id} className="p-6 hover:shadow-2xl transition-all duration-300 border-0 bg-white shadow-lg hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className={`${getWasteTypeColor(listing.wasteType)} border`}>
                      {listing.wasteType.toUpperCase()}
                    </Badge>
                    <Badge className={`${getStatusColor(listing.status)} border`}>
                      {listing.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{listing.wasteType} Waste</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Scale className="h-4 w-4 text-green-600" />
                      <span><strong>{listing.quantity} kg</strong> available</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-600">KES {listing.pricePerKg}/kg</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span>Until {new Date(listing.availableUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Total Value</p>
                        <span className="text-xl font-bold text-green-600">
                          KES {listing.quantity * listing.pricePerKg}
                        </span>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">
                        📞 Contact
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Create Listing Tab */}
        <TabsContent value="create">
          <Card className="p-8 shadow-xl border-0 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold">🆕 Create New Listing</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Waste Type *</Label>
                <Select value={newListing.wasteType} onValueChange={(value) => setNewListing({...newListing, wasteType: value})}>
                  <SelectTrigger className="border-green-200 focus:border-green-400">
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plastic">♻️ Plastic</SelectItem>
                    <SelectItem value="organic">🌱 Organic</SelectItem>
                    <SelectItem value="electronic">📱 Electronic</SelectItem>
                    <SelectItem value="hazardous">⚠️ Hazardous</SelectItem>
                    <SelectItem value="mixed">🔄 Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Quantity (kg) *</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={newListing.quantity}
                  onChange={(e) => setNewListing({...newListing, quantity: e.target.value})}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Price per kg (KES) *</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={newListing.pricePerKg}
                  onChange={(e) => setNewListing({...newListing, pricePerKg: e.target.value})}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Location *</Label>
                <Input
                  placeholder="Nairobi, Kenya"
                  value={newListing.location}
                  onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Available From</Label>
                <Input
                  type="date"
                  value={newListing.availableFrom}
                  onChange={(e) => setNewListing({...newListing, availableFrom: e.target.value})}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Available Until</Label>
                <Input
                  type="date"
                  value={newListing.availableUntil}
                  onChange={(e) => setNewListing({...newListing, availableUntil: e.target.value})}
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label className="text-sm font-medium">Description</Label>
                <textarea
                  className="w-full p-3 border border-green-200 rounded-md focus:border-green-400 focus:outline-none"
                  rows={3}
                  placeholder="Describe your waste materials in detail..."
                  value={newListing.description}
                  onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <Button onClick={handleCreateListing} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                  🚀 Create Listing
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="p-8 shadow-xl border-0 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold">📈 My Transactions</h2>
            </div>

            <div className="text-center py-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No transactions yet</p>
              <p className="text-gray-500">Start buying and selling to see your transaction history</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceFixed;
