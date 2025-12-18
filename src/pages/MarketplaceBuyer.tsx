import Marketplace from "./Marketplace";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Buyer-facing marketplace page: browse listings from sellers only
const MarketplaceBuyer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nairobi Waste Marketplace</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Buy and sell waste materials in Nairobi's most trusted waste marketplace
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search for waste materials..." 
                className="pl-10 pr-4 py-6 rounded-lg bg-background text-foreground"
              />
            </div>
            <Button size="lg" className="gap-2">
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Categories & Filters */}
        <div className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="plastics">Plastics</TabsTrigger>
                <TabsTrigger value="metals">Metals</TabsTrigger>
                <TabsTrigger value="paper">Paper</TabsTrigger>
                <TabsTrigger value="glass">Glass</TabsTrigger>
                <TabsTrigger value="organic">Organic</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            <TabsContent value="all">
              <Marketplace />
            </TabsContent>
            <TabsContent value="plastics">
              <Marketplace category="plastics" />
            </TabsContent>
            <TabsContent value="metals">
              <Marketplace category="metals" />
            </TabsContent>
            <TabsContent value="paper">
              <Marketplace category="paper" />
            </TabsContent>
            <TabsContent value="glass">
              <Marketplace category="glass" />
            </TabsContent>
            <TabsContent value="organic">
              <Marketplace category="organic" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Featured Listings */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Featured Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured listings will be dynamically loaded here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceBuyer;
