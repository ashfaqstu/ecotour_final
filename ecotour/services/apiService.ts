/**
 * API Service for connecting to the Smart Eco Tour Backend
 */

import { TripDetails, SustainabilityPrefs, Itinerary, MatchedTraveler } from '../types';

// Backend API base URL - configurable via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Debug log
console.log('🔗 API_BASE_URL:', API_BASE_URL);

/**
 * Transport mode mapping from frontend to backend enum
 */
const mapTransportMode = (pace: 'relaxed' | 'fast'): string => {
  return pace === 'relaxed' ? 'train' : 'flight';
};

/**
 * Calculate trip duration in days
 */
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

/**
 * Map interests from sustainability preferences to activity types
 */
const mapInterests = (prefs: SustainabilityPrefs): string[] => {
  const interests: string[] = [];
  if (prefs.biodiversity > 50) interests.push('nature');
  if (prefs.community > 50) interests.push('local');
  if (prefs.carbon > 50) interests.push('culture');
  if (interests.length === 0) interests.push('nature', 'culture');
  return interests;
};

/**
 * Transform backend itinerary to frontend format
 */
const transformItinerary = (backendItinerary: any): Itinerary => {
  return {
    id: String(backendItinerary.id),
    title: backendItinerary.title,
    totalScore: Math.round(backendItinerary.sustainability?.total_score || 75),
    breakdown: {
      carbon: Math.round(backendItinerary.sustainability?.breakdown?.transport_score || 70),
      community: Math.round(backendItinerary.sustainability?.breakdown?.local_engagement_score || 65),
      biodiversity: Math.round(backendItinerary.sustainability?.breakdown?.activity_score || 80),
      overtourism: Math.round(backendItinerary.sustainability?.breakdown?.overtourism_score || 75),
    },
    explanation: backendItinerary.sustainability?.explanation || backendItinerary.description || '',
    transportMode: backendItinerary.preferred_transport || 'train',
    accommodationType: 'Eco-Lodge',
    days: backendItinerary.days?.map((day: any) => ({
      day: day.day,
      activity: day.activities?.map((a: any) => a.activity).join(', ') || 'Explore local area',
      transport: day.activities?.[0]?.transport || 'walk',
      accommodation: day.accommodation || 'Eco-friendly homestay',
      sustainabilityNote: `Daily carbon footprint: ${day.total_carbon_kg?.toFixed(1) || '2.5'} kg CO₂`,
    })) || [],
  };
};

/**
 * Transform backend match to frontend MatchedTraveler format
 */
const transformMatch = (backendMatch: any): MatchedTraveler => {
  return {
    id: backendMatch.id || backendMatch.traveler_id,
    name: backendMatch.name || `Traveler_${backendMatch.id}`,
    avatar: `https://i.pravatar.cc/150?u=${backendMatch.id}`,
    matchPercentage: Math.round((backendMatch.similarity || backendMatch.match_score || 0.85) * 100),
    reason: backendMatch.reason || `Similar travel preferences and sustainability goals`,
  };
};

/**
 * Generate itineraries using the backend API
 */
export const generateItinerariesFromBackend = async (
  details: TripDetails,
  prefs: SustainabilityPrefs
): Promise<Itinerary[]> => {
  const days = calculateDays(details.startDate, details.endDate);
  
  const requestBody = {
    origin: details.origin,
    destination: details.destination,
    days: days,
    transport_preference: mapTransportMode(details.travelPace),
    budget: details.budget === 'Luxury' ? 5000 : details.budget === 'Modest' ? 2000 : 1000,
    interests: mapInterests(prefs),
    sustainability_weights: {
      carbon: prefs.carbon / 100,
      local: prefs.community / 100,
      culture: prefs.biodiversity / 100,
      overtourism: prefs.overtourism / 100,
    },
  };

  const response = await fetch(`${API_BASE_URL}/api/generate-itinerary?num_options=3`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Backend API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.status === 'success' && data.itineraries) {
    return data.itineraries.map(transformItinerary);
  }
  
  throw new Error('Invalid response from backend');
};

/**
 * Create a traveler profile for group matching
 */
export const createTravelerProfile = async (
  details: TripDetails,
  prefs: SustainabilityPrefs,
  userId: string,
  userName: string
): Promise<{ success: boolean; profileId: string }> => {
  const days = calculateDays(details.startDate, details.endDate);
  
  const profileData = {
    id: userId,
    name: userName,
    destination: details.destination,
    trip_days: days,
    sustainability_score_min: (prefs.carbon + prefs.community + prefs.biodiversity + prefs.overtourism) / 4,
    interests: mapInterests(prefs),
    max_group_size: 5,
    transport_preference: mapTransportMode(details.travelPace),
  };

  const response = await fetch(`${API_BASE_URL}/api/traveler-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to create profile: ${response.status}`);
  }

  const data = await response.json();
  return {
    success: data.status === 'success',
    profileId: data.traveler_id,
  };
};

/**
 * Find matching travelers for group travel
 */
export const findGroupMatches = async (
  travelerId: string,
  destination?: string,
  minSimilarity: number = 0.7
): Promise<MatchedTraveler[]> => {
  const params = new URLSearchParams({
    traveler_id: travelerId,
    min_similarity: minSimilarity.toString(),
  });
  
  if (destination) {
    params.append('destination', destination);
  }

  const response = await fetch(`${API_BASE_URL}/api/find-group?${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to find matches: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.status === 'success' && data.matches) {
    return data.matches.map(transformMatch);
  }
  
  return [];
};

/**
 * Get list of all travelers
 */
export const listTravelers = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/api/travelers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list travelers: ${response.status}`);
  }

  const data = await response.json();
  return data.travelers || [];
};

/**
 * Get sustainability tips
 */
export const getSustainabilityTips = async (destination?: string): Promise<string[]> => {
  const params = destination ? `?destination=${encodeURIComponent(destination)}` : '';
  
  const response = await fetch(`${API_BASE_URL}/api/sustainability-tips${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Return default tips if endpoint fails
    return [
      'Choose eco-certified accommodations',
      'Use public transportation when possible',
      'Support local businesses and artisans',
      'Minimize single-use plastics',
      'Respect wildlife and natural habitats',
    ];
  }

  const data = await response.json();
  return data.tips || [];
};

/**
 * Health check for the backend
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  const url = `${API_BASE_URL}/api/health`;
  console.log('🏥 Checking backend health at:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    console.log('🏥 Health response:', response.status, response.ok);
    return response.ok;
  } catch (error) {
    console.error('🏥 Health check failed:', error);
    return false;
  }
};

/**
 * Score breakdown response type
 */
export interface ScoreBreakdown {
  transport_score: { value: number; weight: string; explanation: string };
  accommodation_score: { value: number; weight: string; explanation: string };
  activity_score: { value: number; weight: string; explanation: string };
  local_engagement_score: { value: number; weight: string; explanation: string };
  overtourism_score: { value: number; weight: string; explanation: string };
}

export interface ScoreResponse {
  status: string;
  itinerary_id: number;
  title: string;
  total_score: number;
  total_carbon_kg: number;
  breakdown: ScoreBreakdown;
  explanation: string;
  recommendations: string[];
}

/**
 * Score an itinerary and get detailed breakdown
 */
export const scoreItinerary = async (itineraryId: number): Promise<ScoreResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/score-itinerary?itinerary_id=${itineraryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Get itinerary details by ID
 */
export const getItineraryDetails = async (itineraryId: number): Promise<Itinerary | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/itinerary/${itineraryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.status === 'success' && data.itinerary) {
      return transformItinerary(data.itinerary);
    }
    return null;
  } catch {
    return null;
  }
};
