export interface Group {
  id: string;
  name: string;
  ward: string;
  contactPerson: string;
  phoneNumber: string;
  registeredAt: string;
}

export interface WasteEntry {
  id: string;
  groupId: string;
  date: string;
  plastic: number;
  paper: number;
  metal: number;
  glass: number;
  organic: number;
  other: number;
  notes?: string;
}

export interface WasteStats {
  totalRecyclable: number;
  totalCompostable: number;
  totalDiverted: number;
  byCategory: {
    plastic: number;
    paper: number;
    metal: number;
    glass: number;
    organic: number;
    other: number;
  };
}

export const NAIROBI_WARDS = [
  "Westlands",
  "Dagoretti North",
  "Dagoretti South",
  "Langata",
  "Kibra",
  "Roysambu",
  "Kasarani",
  "Ruaraka",
  "Embakasi South",
  "Embakasi North",
  "Embakasi Central",
  "Embakasi East",
  "Embakasi West",
  "Makadara",
  "Kamukunji",
  "Starehe",
  "Mathare",
];
