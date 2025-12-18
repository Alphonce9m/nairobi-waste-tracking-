import { Link } from "react-router-dom";
import { 
  Store, 
  Search, 
  Camera, 
  Truck, 
  MapPin,
  Clock,
  Smartphone,
  DollarSign,
  Leaf,
  BarChart3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-16 px-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Smart Waste Management for Nairobi</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connecting waste generators with collectors through an innovative digital platform
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Link to="/marketplace" className="w-full md:w-auto">
              <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90">
                <Store className="mr-2 h-5 w-5" />
                Explore Marketplace
              </Button>
            </Link>
            <Link to="/analyze" className="w-full md:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-transparent border-white/30 hover:bg-white/10">
                <Search className="mr-2 h-5 w-5" />
                Analyze Waste
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="h-8 w-8 text-primary" />,
              title: "Find or List Waste",
              description: "Browse available waste materials or list your recyclables for collection"
            },
            {
              icon: <MapPin className="h-8 w-8 text-primary" />,
              title: "Get Matched",
              description: "Our system connects you with the nearest waste collectors or buyers"
            },
            {
              icon: <Truck className="h-8 w-8 text-primary" />,
              title: "Schedule Pickup",
              description: "Arrange for convenient waste collection at your location"
            }
          ].map((item, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Making an Impact in Nairobi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2,400+", label: "Tons of Waste Diverted" },
              { value: "85%", label: "Collection Efficiency" },
              { value: "500+", label: "Active Collectors" },
              { value: "24/7", label: "Service Availability" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: <Leaf className="h-6 w-6 text-primary" />,
              title: "Environmental Impact",
              description: "Help reduce landfill waste and promote recycling in Nairobi"
            },
            {
              icon: <DollarSign className="h-6 w-6 text-primary" />,
              title: "Earn Money",
              description: "Monetize your recyclable waste materials"
            },
            {
              icon: <Clock className="h-6 w-6 text-primary" />,
              title: "Save Time",
              description: "Quick and efficient waste collection scheduling"
            },
            {
              icon: <Smartphone className="h-6 w-6 text-primary" />,
              title: "Easy to Use",
              description: "Simple interface for both waste generators and collectors"
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/marketplace">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-success/10 to-success/5 border-success/20 h-full">
              <Store className="h-8 w-8 text-success mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Marketplace</h3>
              <p className="text-sm text-muted-foreground">Buy and sell recyclable materials</p>
            </Card>
          </Link>
          <Link to="/analyze">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 h-full">
              <Camera className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Waste Analysis</h3>
              <p className="text-sm text-muted-foreground">Analyze and categorize your waste</p>
            </Card>
          </Link>
          <Link to="/dashboard">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 h-full">
              <BarChart3 className="h-8 w-8 text-warning mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">View Progress</h3>
              <p className="text-sm text-muted-foreground">Track your waste management impact</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/10 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-8">Join our growing community of environmentally conscious citizens and businesses in Nairobi.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="gap-2">
                <Store className="h-5 w-5" />
                Visit Marketplace
              </Button>
            </Link>
            <Link to="/analyze">
              <Button size="lg" variant="outline" className="gap-2">
                <Camera className="h-5 w-5" />
                Analyze Waste
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;