
export interface SustainabilityPrefs {
  carbon: number;
  community: number;
  biodiversity: number;
  overtourism: number;
}

export interface TripDetails {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  groupTravel: boolean;
  travelPace: 'relaxed' | 'fast';
}

export interface DayActivity {
  day: number;
  activity: string;
  transport: string;
  accommodation: string;
  sustainabilityNote: string;
}

export interface Itinerary {
  id: string;
  title: string;
  totalScore: number;
  breakdown: {
    carbon: number;
    community: number;
    biodiversity: number;
    overtourism: number;
  };
  explanation: string;
  days: DayActivity[];
  transportMode: string;
  accommodationType: string;
}

export interface MatchedTraveler {
  id: string;
  name: string;
  avatar: string;
  matchPercentage: number;
  reason: string;
}
