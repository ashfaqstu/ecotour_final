import { TripDetails, SustainabilityPrefs, Itinerary } from "../types";
import { generateItinerariesFromBackend, checkBackendHealth } from "./apiService";

/**
 * Generate demo itineraries when backend is unavailable
 */
const generateDemoItineraries = (details: TripDetails, prefs: SustainabilityPrefs): Itinerary[] => {
  console.log("showing demo data");
  
  const days = Math.max(1, Math.ceil((new Date(details.endDate).getTime() - new Date(details.startDate).getTime()) / (1000 * 60 * 60 * 24)));
  
  const templates = [
    {
      id: "demo-1",
      title: `Sustainable ${details.destination} Explorer`,
      totalScore: 85,
      breakdown: { carbon: 90, community: 80, biodiversity: 85, overtourism: 85 },
      explanation: "Low-carbon journey with local community engagement and eco-friendly stays.",
      transportMode: "train",
      accommodationType: "Eco-Lodge",
    },
    {
      id: "demo-2", 
      title: `Green ${details.destination} Adventure`,
      totalScore: 78,
      breakdown: { carbon: 75, community: 85, biodiversity: 80, overtourism: 72 },
      explanation: "Balanced adventure with focus on supporting local businesses.",
      transportMode: "bus",
      accommodationType: "Local Homestay",
    },
    {
      id: "demo-3",
      title: `${details.destination} Cultural Immersion`,
      totalScore: 82,
      breakdown: { carbon: 80, community: 90, biodiversity: 75, overtourism: 83 },
      explanation: "Deep cultural experience with minimal environmental footprint.",
      transportMode: "train",
      accommodationType: "Boutique Hotel",
    },
  ];

  return templates.map(template => ({
    ...template,
    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      activity: `Explore local ${i % 2 === 0 ? 'markets and artisans' : 'nature and culture'} in ${details.destination}`,
      transport: template.transportMode,
      accommodation: template.accommodationType,
      sustainabilityNote: `Day ${i + 1}: Low-carbon activities supporting local community`,
    })),
  }));
};

/**
 * Generate itineraries - tries backend with 30s timeout, falls back to demo data
 */
export const generateItineraries = async (
  details: TripDetails,
  prefs: SustainabilityPrefs
): Promise<Itinerary[]> => {
  // Create a timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Request timeout after 30 seconds")), 30000);
  });

  // Try backend with timeout
  try {
    const isBackendAvailable = await Promise.race([
      checkBackendHealth(),
      timeoutPromise,
    ]);
    
    if (isBackendAvailable) {
      console.log("Using backend API for itinerary generation...");
      const itineraries = await Promise.race([
        generateItinerariesFromBackend(details, prefs),
        timeoutPromise,
      ]);
      if (itineraries && itineraries.length > 0) {
        return itineraries;
      }
    }
  } catch (error) {
    console.warn("Backend API failed or timed out:", error);
  }

  // Fall back to demo data
  return generateDemoItineraries(details, prefs);
};
