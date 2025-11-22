import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Recycle, Target, Users, Truck, Store, Flame, TreePine, Droplets, Wind, AlertTriangle, TrendingUp, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { nairobiStats2024 } from "@/lib/climateData";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const Home = () => {
  const [wasteCollected, setWasteCollected] = useState(0);
  const [recyclingRate, setRecyclingRate] = useState(0);

  useEffect(() => {
    const wasteInterval = setInterval(() => {
      setWasteCollected(prev => {
        if (prev < nairobiStats2024.wasteManagement.dailyWaste) {
          return Math.min(prev + 0.05, nairobiStats2024.wasteManagement.dailyWaste);
        }
        return prev;
      });
    }, 50);

    const recyclingInterval = setInterval(() => {
      setRecyclingRate(prev => {
        if (prev < nairobiStats2024.wasteManagement.recyclingRate) {
          return Math.min(prev + 0.5, nairobiStats2024.wasteManagement.recyclingRate);
        }
        return prev;
      });
    }, 50);

    return () => {
      clearInterval(wasteInterval);
      clearInterval(recyclingInterval);
    };
  }, []);

  const wasteData = [
    { year: "2019", collected: 1.2, recycled: 0.05 },
    { year: "2020", collected: 1.4, recycled: 0.08 },
    { year: "2021", collected: 1.6, recycled: 0.1 },
    { year: "2022", collected: 1.8, recycled: 0.12 },
    { year: "2023", collected: 1.9, recycled: 0.14 },
    { year: "2024", collected: 2.0, recycled: 0.16 },
  ];

  const wasteComposition = [
    { type: "Organic", value: 60, color: "hsl(var(--primary))" },
    { type: "Plastic", value: 12, color: "hsl(var(--secondary))" },
    { type: "Paper", value: 10, color: "hsl(var(--accent))" },
    { type: "Metal", value: 8, color: "hsl(var(--warning))" },
    { type: "Glass", value: 5, color: "hsl(var(--success))" },
    { type: "Other", value: 5, color: "hsl(var(--muted-foreground))" },
  ];

  const collectionRates = [
    { area: "Westlands", rate: 78 },
    { area: "Lang'ata", rate: 72 },
    { area: "Dagoretti", rate: 65 },
    { area: "Kasarani", rate: 60 },
    { area: "Embakasi", rate: 55 },
    { area: "Kibra", rate: 45 },
  ];

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Nairobi Waste Management Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Tracking waste collection and recycling efforts across Nairobi's neighborhoods
        </p>
      </header>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link to="/groups">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <Users className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Collector Dashboard</h3>
            <p className="text-sm text-muted-foreground">Manage your waste collection operations and service requests</p>
          </Card>
        </Link>
        <Link to="/marketplace">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <Store className="h-8 w-8 text-success mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Marketplace</h3>
            <p className="text-sm text-muted-foreground">Buy and sell recyclable materials</p>
          </Card>
        </Link>
        <Link to="/dashboard">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <Target className="h-8 w-8 text-warning mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">View Progress</h3>
            <p className="text-sm text-muted-foreground">See collective impact and group leaderboard</p>
          </Card>
        </Link>
      </div>

      {/* Global Context - Why This Matters */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <h2 className="text-2xl font-bold text-foreground mb-4">Why Waste Tracking Matters</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-destructive" />
              The Dandora Challenge
            </h3>
            <p className="text-sm text-muted-foreground">
              Dandora dumping site receives over 2,000 tons of waste daily, impacting health and environment 
              of surrounding communities. Our tracking helps divert recyclable and compostable waste.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Your Impact
            </h3>
            <p className="text-sm text-muted-foreground">
              Every kilogram of waste diverted from Dandora reduces methane emissions, prevents soil 
              contamination, and creates opportunities for recycling and composting initiatives.
            </p>
          </div>
        </div>
      </Card>

      {/* Waste Management Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 animate-scale-in">
          <div className="flex items-start justify-between mb-2">
            <Recycle className="h-5 w-5 text-primary" />
            <TrendingUp className="h-4 w-4 text-destructive" />
          </div>
          <div className="text-3xl font-bold text-primary">
            {wasteCollected.toFixed(1)}M kg
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Daily waste generated
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-start justify-between mb-2">
            <Recycle className="h-5 w-5 text-secondary" />
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="text-3xl font-bold text-secondary">
            {recyclingRate.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Recycling rate
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-start justify-between mb-2">
            <Users className="h-5 w-5 text-accent" />
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
          <div className="text-3xl font-bold text-accent">
            {nairobiStats2024.wasteManagement.collectionRate}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Waste collection rate
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20 animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-start justify-between mb-2">
            <Target className="h-5 w-5 text-success" />
            <span className="text-xs text-muted-foreground">target</span>
          </div>
          <div className="text-3xl font-bold text-success">
            {nairobiStats2024.greenSpaces.coverage}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Green space coverage
          </div>
        </Card>
      </div>

      {/* Waste Generation Trend */}
      <Card className="p-6 mb-6 animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Waste Generation in Nairobi (2019-2024)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={wasteData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Million kg/day', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value}M kg`, 'Waste']} />
              <Area
                type="monotone"
                dataKey="collected"
                name="Waste Generated"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary)/0.2)"
              />
              <Area
                type="monotone"
                dataKey="recycled"
                name="Recycled"
                stroke="hsl(var(--success))"
                fill="hsl(var(--success)/0.2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Waste Composition */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Waste Composition</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteComposition}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {wasteComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Collection Rates by Area</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={collectionRates}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="area" type="category" />
                <Tooltip formatter={(value) => [`${value}%`, 'Collection Rate']} />
                <Bar dataKey="rate" fill="hsl(var(--primary))">
                  {collectionRates.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(var(--primary)/${0.5 + (index * 0.1)})`} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Join Nairobi's Waste Management Revolution</h3>
            <p className="text-muted-foreground">
              Be part of the solution. Track your waste, connect with local initiatives, and help make Nairobi cleaner and greener.
            </p>
          </div>
          <Button className="mt-4 md:mt-0" size="lg">
            Get Started
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Home;
