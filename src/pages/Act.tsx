import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { carbonFootprintFactors } from "@/lib/climateData";
import { Calculator, Leaf, CheckCircle2, TrendingDown, Zap, Car, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CarbonInputs {
  electricity: number;
  naturalGas: number;
  carMiles: number;
  flights: number;
  beef: number;
  pork: number;
  chicken: number;
  waste: number;
}

interface Action {
  id: string;
  title: string;
  description: string;
  impact: string;
  points: number;
  category: string;
}

const actions: Action[] = [
  {
    id: "led-bulbs",
    title: "Switch to LED Bulbs",
    description: "Replace all incandescent bulbs with energy-efficient LEDs",
    impact: "Save 450 kg CO₂/year",
    points: 20,
    category: "Energy",
  },
  {
    id: "thermostat",
    title: "Smart Thermostat",
    description: "Install and use a programmable thermostat",
    impact: "Save 650 kg CO₂/year",
    points: 30,
    category: "Energy",
  },
  {
    id: "public-transit",
    title: "Use Public Transit",
    description: "Replace car trips with public transportation 2x/week",
    impact: "Save 1,000 kg CO₂/year",
    points: 40,
    category: "Transport",
  },
  {
    id: "bike-commute",
    title: "Bike to Work",
    description: "Cycle or walk for short trips instead of driving",
    impact: "Save 1,200 kg CO₂/year",
    points: 50,
    category: "Transport",
  },
  {
    id: "meatless-monday",
    title: "Meatless Mondays",
    description: "Go vegetarian one day per week",
    impact: "Save 300 kg CO₂/year",
    points: 25,
    category: "Diet",
  },
  {
    id: "reduce-beef",
    title: "Reduce Beef Consumption",
    description: "Cut beef consumption by 50%",
    impact: "Save 700 kg CO₂/year",
    points: 35,
    category: "Diet",
  },
  {
    id: "composting",
    title: "Start Composting",
    description: "Compost food scraps and yard waste",
    impact: "Save 200 kg CO₂/year",
    points: 20,
    category: "Waste",
  },
  {
    id: "reusable-bags",
    title: "Use Reusable Bags",
    description: "Switch to reusable shopping bags and containers",
    impact: "Save 100 kg CO₂/year",
    points: 15,
    category: "Waste",
  },
];

const Act = () => {
  const { toast } = useToast();
  const [carbonInputs, setCarbonInputs] = useState<CarbonInputs>({
    electricity: 900,
    naturalGas: 50,
    carMiles: 12000,
    flights: 2,
    beef: 20,
    pork: 15,
    chicken: 25,
    waste: 500,
  });
  const [showResults, setShowResults] = useState(false);
  const [completedActions, setCompletedActions] = useLocalStorage<string[]>(
    "completedActions",
    []
  );
  const [totalPoints, setTotalPoints] = useLocalStorage<number>("actionPoints", 0);

  const calculateFootprint = () => {
    const electricity = carbonInputs.electricity * 12 * carbonFootprintFactors.electricity;
    const gas = carbonInputs.naturalGas * 12 * carbonFootprintFactors.naturalGas;
    const car = carbonInputs.carMiles * carbonFootprintFactors.car;
    const flights = carbonInputs.flights * 1000 * carbonFootprintFactors.flight.medium;
    const beef = carbonInputs.beef * 12 * carbonFootprintFactors.meat.beef;
    const pork = carbonInputs.pork * 12 * carbonFootprintFactors.meat.pork;
    const chicken = carbonInputs.chicken * 12 * carbonFootprintFactors.meat.chicken;
    const waste = carbonInputs.waste * 12 * carbonFootprintFactors.waste;

    return {
      total: electricity + gas + car + flights + beef + pork + chicken + waste,
      breakdown: [
        { category: "Home Energy", value: Math.round(electricity + gas), color: "hsl(var(--primary))" },
        { category: "Transportation", value: Math.round(car + flights), color: "hsl(var(--secondary))" },
        { category: "Food", value: Math.round(beef + pork + chicken), color: "hsl(var(--accent))" },
        { category: "Waste", value: Math.round(waste), color: "hsl(var(--success))" },
      ],
    };
  };

  const footprint = calculateFootprint();

  const handleCalculate = () => {
    setShowResults(true);
    toast({
      title: "Footprint Calculated!",
      description: `Your annual carbon footprint is ${Math.round(footprint.total / 1000)} tons CO₂`,
    });
  };

  const toggleAction = (actionId: string) => {
    const action = actions.find((a) => a.id === actionId);
    if (!action) return;

    if (completedActions.includes(actionId)) {
      setCompletedActions(completedActions.filter((id) => id !== actionId));
      setTotalPoints(totalPoints - action.points);
      toast({
        title: "Action Removed",
        description: `Lost ${action.points} points`,
      });
    } else {
      setCompletedActions([...completedActions, actionId]);
      setTotalPoints(totalPoints + action.points);
      toast({
        title: "Great Job! 🎉",
        description: `Earned ${action.points} points!`,
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Energy":
        return <Zap className="h-4 w-4" />;
      case "Transport":
        return <Car className="h-4 w-4" />;
      case "Diet":
        return <Leaf className="h-4 w-4" />;
      case "Waste":
        return <Home className="h-4 w-4" />;
      default:
        return <Leaf className="h-4 w-4" />;
    }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">Take Action</h1>
        <p className="text-muted-foreground text-lg">
          Track your impact and reduce your footprint
        </p>
      </header>

      {/* Points Card */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your Impact Points</p>
            <p className="text-4xl font-bold text-primary">{totalPoints}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {completedActions.length} actions completed
            </p>
          </div>
          <div className="p-4 bg-primary/20 rounded-full">
            <Leaf className="h-12 w-12 text-primary" />
          </div>
        </div>
      </Card>

      {/* Carbon Calculator */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Carbon Footprint Calculator</h2>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="electricity">Monthly Electricity (kWh)</Label>
              <Input
                id="electricity"
                type="number"
                value={carbonInputs.electricity}
                onChange={(e) =>
                  setCarbonInputs({ ...carbonInputs, electricity: Number(e.target.value) })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="gas">Monthly Natural Gas (therms)</Label>
              <Input
                id="gas"
                type="number"
                value={carbonInputs.naturalGas}
                onChange={(e) =>
                  setCarbonInputs({ ...carbonInputs, naturalGas: Number(e.target.value) })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="car">Annual Car Miles</Label>
              <Input
                id="car"
                type="number"
                value={carbonInputs.carMiles}
                onChange={(e) =>
                  setCarbonInputs({ ...carbonInputs, carMiles: Number(e.target.value) })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="flights">Annual Flights</Label>
              <Input
                id="flights"
                type="number"
                value={carbonInputs.flights}
                onChange={(e) =>
                  setCarbonInputs({ ...carbonInputs, flights: Number(e.target.value) })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label>Monthly Beef (kg): {carbonInputs.beef}</Label>
              <Slider
                value={[carbonInputs.beef]}
                onValueChange={([value]) =>
                  setCarbonInputs({ ...carbonInputs, beef: value })
                }
                max={50}
                step={1}
                className="mt-3"
              />
            </div>

            <div>
              <Label>Monthly Pork (kg): {carbonInputs.pork}</Label>
              <Slider
                value={[carbonInputs.pork]}
                onValueChange={([value]) =>
                  setCarbonInputs({ ...carbonInputs, pork: value })
                }
                max={50}
                step={1}
                className="mt-3"
              />
            </div>

            <div>
              <Label>Monthly Chicken (kg): {carbonInputs.chicken}</Label>
              <Slider
                value={[carbonInputs.chicken]}
                onValueChange={([value]) =>
                  setCarbonInputs({ ...carbonInputs, chicken: value })
                }
                max={50}
                step={1}
                className="mt-3"
              />
            </div>

            <div>
              <Label>Monthly Waste (kg): {carbonInputs.waste}</Label>
              <Slider
                value={[carbonInputs.waste]}
                onValueChange={([value]) =>
                  setCarbonInputs({ ...carbonInputs, waste: value })
                }
                max={1000}
                step={10}
                className="mt-3"
              />
            </div>
          </div>

          <Button onClick={handleCalculate} size="lg" className="w-full">
            Calculate My Footprint
          </Button>
        </div>

        {showResults && (
          <div className="mt-8 pt-8 border-t border-border animate-fade-in">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-2">Annual Carbon Footprint</p>
              <p className="text-5xl font-bold text-primary mb-2">
                {Math.round(footprint.total / 1000)}
              </p>
              <p className="text-lg text-muted-foreground">tons CO₂</p>
              <Badge variant="secondary" className="mt-3">
                {footprint.total < 8000
                  ? "Below Average"
                  : footprint.total < 16000
                  ? "Average"
                  : "Above Average"}
              </Badge>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={footprint.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ category, value }) =>
                    `${category}: ${value} kg`
                  }
                >
                  {footprint.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="bg-muted p-4 rounded-lg mt-6">
              <p className="text-sm text-foreground">
                <TrendingDown className="inline h-4 w-4 text-success mr-1" />
                The global average is ~4 tons per person. The US average is ~16 tons.
                Every action below helps reduce your footprint!
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Action Tracker */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Sustainable Actions</h2>
        <div className="grid gap-4">
          {actions.map((action) => {
            const isCompleted = completedActions.includes(action.id);

            return (
              <Card
                key={action.id}
                className={`p-5 transition-all cursor-pointer hover:shadow-lg ${
                  isCompleted ? "border-success bg-success/5" : ""
                }`}
                onClick={() => toggleAction(action.id)}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => toggleAction(action.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                        {isCompleted && <CheckCircle2 className="h-5 w-5 text-success" />}
                        {action.title}
                      </h3>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getCategoryIcon(action.category)}
                        {action.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {action.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-success">
                        {action.impact}
                      </span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                        +{action.points} points
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Act;
