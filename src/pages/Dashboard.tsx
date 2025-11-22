import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSupabase } from "@/contexts/SupabaseContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Target, Users, Recycle, Leaf, Award } from "lucide-react";
import { Group, WasteEntry } from "@/types/waste";

const Dashboard = () => {
  const { user } = useSupabase();
  const [groups] = useLocalStorage<Group[]>("nairobiwaste-groups", []);
  const [wasteEntries] = useLocalStorage<WasteEntry[]>("nairobiwaste-entries", []);
  const [currentGroup] = useLocalStorage<string | null>("nairobiwaste-currentgroup", null);

  const ANNUAL_GOAL = 1000000; // 1,000 tons in kg

  const calculateAllStats = () => {
    const totalRecyclable = wasteEntries.reduce((sum, e) => sum + e.plastic + e.paper + e.metal + e.glass, 0);
    const totalCompostable = wasteEntries.reduce((sum, e) => sum + e.organic, 0);
    const totalOther = wasteEntries.reduce((sum, e) => sum + e.other, 0);
    const totalDiverted = totalRecyclable + totalCompostable;

    return {
      totalRecyclable,
      totalCompostable,
      totalOther,
      totalDiverted,
      total: totalRecyclable + totalCompostable + totalOther,
    };
  };

  const calculateGroupStats = (groupId: string) => {
    const entries = wasteEntries.filter(e => e.groupId === groupId);
    const recyclable = entries.reduce((sum, e) => sum + e.plastic + e.paper + e.metal + e.glass, 0);
    const compostable = entries.reduce((sum, e) => sum + e.organic, 0);
    const other = entries.reduce((sum, e) => sum + e.other, 0);
    return {
      recyclable,
      compostable,
      diverted: recyclable + compostable,
      total: recyclable + compostable + other,
      entries: entries.length,
    };
  };

  const allStats = calculateAllStats();
  const groupsWithStats = groups.map(group => ({
    ...group,
    stats: calculateGroupStats(group.id),
  })).sort((a, b) => b.stats.diverted - a.stats.diverted);

  const categoryData = [
    { name: "Plastic", value: wasteEntries.reduce((sum, e) => sum + e.plastic, 0), color: "hsl(var(--primary))" },
    { name: "Paper", value: wasteEntries.reduce((sum, e) => sum + e.paper, 0), color: "hsl(var(--secondary))" },
    { name: "Metal", value: wasteEntries.reduce((sum, e) => sum + e.metal, 0), color: "hsl(var(--accent))" },
    { name: "Glass", value: wasteEntries.reduce((sum, e) => sum + e.glass, 0), color: "hsl(var(--success))" },
    { name: "Organic", value: wasteEntries.reduce((sum, e) => sum + e.organic, 0), color: "hsl(var(--info))" },
  ].filter(item => item.value > 0);

  const progressPercent = (allStats.totalDiverted / ANNUAL_GOAL) * 100;

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {user ? "Your Impact Dashboard" : "Impact Dashboard"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {user 
            ? "Track your group's waste collection progress and see your ranking"
            : "Collective waste reduction across Nairobi groups"
          }
        </p>
      </header>

      {/* Personalized welcome for signed-in users */}
      {user && currentGroup && (
        <Card className="p-6 mb-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-6 w-6 text-success" />
            <h2 className="text-xl font-bold text-foreground">Welcome back!</h2>
          </div>
          <p className="text-muted-foreground">
            Your group is making a real difference in Nairobi's waste management. Keep up the great work!
          </p>
        </Card>
      )}

      {/* Prompt for signed-in users without a group */}
      {user && !currentGroup && (
        <Card className="p-6 mb-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-warning" />
            <h2 className="text-xl font-bold text-foreground">Join a Group</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            You're signed in but haven't linked to a waste collection group yet. Visit the Groups page to register or join a group.
          </p>
          <a href="/groups" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            Go to Groups
          </a>
        </Card>
      )}

      {/* Annual Goal Progress */}
      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">2025 Dandora Diversion Goal</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-bold text-foreground">{(allStats.totalDiverted / 1000).toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">tons diverted of 1,000 goal</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {progressPercent.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {(ANNUAL_GOAL / 1000 - allStats.totalDiverted / 1000).toFixed(1)} tons remaining to reach goal
          </p>
        </div>
      </Card>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Active Groups</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{groups.length}</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <Recycle className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Recyclable</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{(allStats.totalRecyclable / 1000).toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">tons</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-success/10 to-success/5">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="h-5 w-5 text-success" />
            <p className="text-sm text-muted-foreground">Compostable</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{(allStats.totalCompostable / 1000).toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">tons</p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-secondary/10 to-secondary/5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            <p className="text-sm text-muted-foreground">Total Impact</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{(allStats.totalDiverted / 1000).toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">tons diverted</p>
        </Card>
      </div>

      {/* Waste Category Breakdown */}
      {categoryData.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Waste by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${(value / 1000).toFixed(1)}t`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${(value / 1000).toFixed(2)} tons`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Group Leaderboard */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Group Leaderboard</h2>
        </div>
        {groupsWithStats.length > 0 ? (
          <div className="space-y-4">
            {groupsWithStats.map((group, index) => (
              <div key={group.id} className={`p-4 rounded-lg ${index === 0 ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {index < 3 && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        'bg-orange-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    )}
                    {index >= 3 && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
                        {index + 1}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.ward}</p>
                    </div>
                  </div>
                  <Badge variant={group.id === currentGroup ? "default" : "outline"}>
                    {group.stats.entries} entries
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Recyclable</p>
                    <p className="font-semibold text-foreground">{(group.stats.recyclable / 1000).toFixed(2)}t</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Compostable</p>
                    <p className="font-semibold text-foreground">{(group.stats.compostable / 1000).toFixed(2)}t</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Diverted</p>
                    <p className="font-semibold text-primary">{(group.stats.diverted / 1000).toFixed(2)}t</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No groups registered yet. Groups will appear here once they start tracking waste.
          </p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
