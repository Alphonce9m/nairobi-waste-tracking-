import { useState } from "react";
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
import { Users, Plus, TrendingUp, Recycle, Leaf } from "lucide-react";
import { Group, WasteEntry, NAIROBI_WARDS } from "@/types/waste";

const Groups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useLocalStorage<Group[]>("nairobiwaste-groups", []);
  const [wasteEntries, setWasteEntries] = useLocalStorage<WasteEntry[]>("nairobiwaste-entries", []);
  const [currentGroup, setCurrentGroup] = useLocalStorage<string | null>("nairobiwaste-currentgroup", null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEntryOpen, setIsEntryOpen] = useState(false);

  const [newGroup, setNewGroup] = useState({
    name: "",
    ward: "",
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
    if (!newGroup.name || !newGroup.ward || !newGroup.contactPerson || !newGroup.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const group: Group = {
      id: Date.now().toString(),
      ...newGroup,
      registeredAt: new Date().toISOString(),
    };

    setGroups([...groups, group]);
    setCurrentGroup(group.id);
    setIsRegisterOpen(false);
    setNewGroup({ name: "", ward: "", contactPerson: "", phoneNumber: "" });

    toast({
      title: "Group Registered! 🎉",
      description: `${group.name} is now part of Nairobi's waste tracking initiative`,
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
      title: "Entry Recorded! ♻️",
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

  return (
    <div className="pb-20 px-4 pt-6 max-w-screen-xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-foreground mb-2">Nairobi Waste Groups</h1>
        <p className="text-muted-foreground text-lg">
          Track waste collection and reduce Dandora dumping site impact
        </p>
      </header>

      {/* Current Group Selection */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Your Group</h2>
          </div>
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Register Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="groupName">Group Name *</Label>
                  <Input
                    id="groupName"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="e.g., Kibera Clean Team"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="ward">Ward in Nairobi *</Label>
                  <Select value={newGroup.ward} onValueChange={(value) => setNewGroup({ ...newGroup, ward: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {NAIROBI_WARDS.map((ward) => (
                        <SelectItem key={ward} value={ward}>
                          {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={newGroup.contactPerson}
                    onChange={(e) => setNewGroup({ ...newGroup, contactPerson: e.target.value })}
                    placeholder="Full name"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={newGroup.phoneNumber}
                    onChange={(e) => setNewGroup({ ...newGroup, phoneNumber: e.target.value })}
                    placeholder="e.g., +254 700 000 000"
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleRegisterGroup} className="w-full">
                  Register Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {selectedGroup ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">{selectedGroup.name}</h3>
              <Badge variant="secondary">{selectedGroup.ward}</Badge>
            </div>
            <p className="text-muted-foreground">
              Contact: {selectedGroup.contactPerson} • {selectedGroup.phoneNumber}
            </p>
            {groups.length > 1 && (
              <Select value={currentGroup || ""} onValueChange={setCurrentGroup}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Switch group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} - {group.ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No group registered yet. Click "Register Group" to get started.
          </p>
        )}
      </Card>

      {selectedGroup && (
        <>
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <Recycle className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Recyclable</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{allStats.recyclable}</p>
              <p className="text-xs text-muted-foreground mt-1">kg collected</p>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-success/10 to-success/5">
              <div className="flex items-center gap-3 mb-2">
                <Leaf className="h-5 w-5 text-success" />
                <p className="text-sm text-muted-foreground">Compostable</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{allStats.compostable}</p>
              <p className="text-xs text-muted-foreground mt-1">kg collected</p>
            </Card>
            <Card className="p-5 bg-gradient-to-br from-secondary/10 to-secondary/5">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <p className="text-sm text-muted-foreground">Diverted from Dandora</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{allStats.totalDiverted}</p>
              <p className="text-xs text-muted-foreground mt-1">kg saved</p>
            </Card>
          </div>

          {/* Data Entry */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Weekly Waste Entry</h2>
              <Dialog open={isEntryOpen} onOpenChange={setIsEntryOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Record Waste Collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label className="text-base font-semibold text-foreground mb-3 block">
                        Recyclables (kg)
                      </Label>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="plastic">Plastic</Label>
                          <Input
                            id="plastic"
                            type="number"
                            min="0"
                            step="0.1"
                            value={newEntry.plastic}
                            onChange={(e) => setNewEntry({ ...newEntry, plastic: parseFloat(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="paper">Paper</Label>
                          <Input
                            id="paper"
                            type="number"
                            min="0"
                            step="0.1"
                            value={newEntry.paper}
                            onChange={(e) => setNewEntry({ ...newEntry, paper: parseFloat(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="metal">Metal</Label>
                          <Input
                            id="metal"
                            type="number"
                            min="0"
                            step="0.1"
                            value={newEntry.metal}
                            onChange={(e) => setNewEntry({ ...newEntry, metal: parseFloat(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="glass">Glass</Label>
                          <Input
                            id="glass"
                            type="number"
                            min="0"
                            step="0.1"
                            value={newEntry.glass}
                            onChange={(e) => setNewEntry({ ...newEntry, glass: parseFloat(e.target.value) || 0 })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold text-foreground mb-3 block">
                        Compostable (kg)
                      </Label>
                      <div>
                        <Label htmlFor="organic">Organic/Food Waste</Label>
                        <Input
                          id="organic"
                          type="number"
                          min="0"
                          step="0.1"
                          value={newEntry.organic}
                          onChange={(e) => setNewEntry({ ...newEntry, organic: parseFloat(e.target.value) || 0 })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold text-foreground mb-3 block">
                        Other (kg)
                      </Label>
                      <div>
                        <Label htmlFor="other">Other Waste</Label>
                        <Input
                          id="other"
                          type="number"
                          min="0"
                          step="0.1"
                          value={newEntry.other}
                          onChange={(e) => setNewEntry({ ...newEntry, other: parseFloat(e.target.value) || 0 })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        value={newEntry.notes}
                        onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                        placeholder="Any additional information..."
                        className="mt-1"
                      />
                    </div>

                    <Button onClick={handleSubmitEntry} className="w-full">
                      Submit Entry
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {groupEntries.length > 0 ? (
              <div className="space-y-3">
                {groupEntries.slice(-5).reverse().map((entry) => {
                  const total = entry.plastic + entry.paper + entry.metal + entry.glass + entry.organic + entry.other;
                  const recyclable = entry.plastic + entry.paper + entry.metal + entry.glass;
                  return (
                    <Card key={entry.id} className="p-4 bg-muted/50">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">
                          {new Date(entry.date).toLocaleDateString('en-GB')}
                        </p>
                        <Badge variant="outline">{total} kg total</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Recyclable: <span className="font-medium text-foreground">{recyclable} kg</span></p>
                        <p className="text-muted-foreground">Compostable: <span className="font-medium text-foreground">{entry.organic} kg</span></p>
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">{entry.notes}</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No entries yet. Click "Add Entry" to record your first collection.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Groups;
