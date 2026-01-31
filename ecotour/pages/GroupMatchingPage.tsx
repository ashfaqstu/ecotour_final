import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, MessageCircle, UserPlus, Heart, Sprout, Loader2 } from 'lucide-react';
import { MatchedTraveler, TripDetails, SustainabilityPrefs } from '../types';
import { findGroupMatches, createTravelerProfile, checkBackendHealth } from '../services/apiService';

// Fallback mock data when backend is unavailable
const MOCK_MATCHES: MatchedTraveler[] = [
  { id: '1', name: 'Daisy_Lover', avatar: 'https://i.pravatar.cc/150?u=sarah', matchPercentage: 94, reason: 'Strong sync on carbon care and slow pace.' },
  { id: '2', name: 'Forest_Friend', avatar: 'https://i.pravatar.cc/150?u=mark', matchPercentage: 88, reason: 'Both support the same village lodges.' },
  { id: '3', name: 'River_Run', avatar: 'https://i.pravatar.cc/150?u=elena', matchPercentage: 82, reason: 'Shared goal to protect riparian biomes.' }
];

interface GroupMatchingPageProps {
  trip?: TripDetails | null;
  prefs?: SustainabilityPrefs | null;
}

export const GroupMatchingPage: React.FC<GroupMatchingPageProps> = ({ 
  trip, 
  prefs
}) => {
  const userId = 'eco-traveler';
  const userName = 'Eco Traveler';
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchedTraveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if backend is available
        const isBackendAvailable = await checkBackendHealth();
        
        if (isBackendAvailable && trip && prefs) {
          // Create/update traveler profile first
          await createTravelerProfile(trip, prefs, userId, userName);
          
          // Then find matches
          const foundMatches = await findGroupMatches(userId, trip.destination);
          
          if (foundMatches.length > 0) {
            setMatches(foundMatches);
            setUsingMockData(false);
          } else {
            // No matches found, use mock data for demo
            setMatches(MOCK_MATCHES);
            setUsingMockData(true);
          }
        } else {
          // Backend unavailable, use mock data
          setMatches(MOCK_MATCHES);
          setUsingMockData(true);
        }
      } catch (err) {
        console.warn('Error loading matches, using mock data:', err);
        setMatches(MOCK_MATCHES);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [trip, prefs, userId, userName]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-12 space-y-12">
        <div className="relative w-32 h-32">
          <Loader2 className="w-full h-full text-eco-green/20 animate-spin" strokeWidth={1} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users size={48} className="text-eco-green animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-2">Finding Your Tribe...</h3>
          <p className="font-sans text-gray-500 dark:text-gray-400 animate-pulse">Searching for like-minded eco-travelers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-20">
      <button onClick={() => navigate('/details')} className="flex items-center font-sans font-bold text-gray-400 dark:text-gray-500 hover:text-eco-green transition-colors mb-14">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Camp
      </button>

      <div className="mb-20 text-center">
        <div className="inline-flex p-4 bg-eco-green-light dark:bg-eco-green/20 rounded-full text-eco-green mb-6 shadow-sm">
          <Users className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-display font-extrabold text-gray-900 dark:text-white mb-4">The Garden Lobby</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-sans">
          We found {matches.length} other sprouts who want to care for the world just like you do.
        </p>
        {usingMockData && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            (Showing sample matches - connect backend for real matching)
          </p>
        )}
      </div>

      <div className="space-y-8">
        {matches.map((match) => (
          <div key={match.id} className="organic-card p-10 flex flex-col md:flex-row items-center gap-12 group">
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-8 border-eco-beige dark:border-eco-dark shadow-inner">
                <img src={match.avatar} alt={match.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-eco-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Sprout size={12} /> {match.matchPercentage}%
              </div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-4">
              <h3 className="text-2xl font-display font-extrabold text-gray-800 dark:text-white">{match.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-sans leading-relaxed italic">{match.reason}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-1 bg-eco-green-light dark:bg-eco-green/20 text-eco-green text-[10px] font-bold uppercase tracking-widest rounded-full">Nature Pro</span>
                <span className="px-4 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Local Lover</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button className="bg-eco-green text-white px-8 py-4 rounded-full font-display font-bold shadow-lg shadow-eco-green/20 btn-grow flex items-center justify-center gap-2">
                <MessageCircle size={18} /> Chat
              </button>
              <button className="bg-eco-beige dark:bg-eco-dark/50 text-gray-500 dark:text-gray-400 px-8 py-4 rounded-full font-display font-bold hover:text-eco-green dark:hover:text-eco-green transition-colors flex items-center justify-center gap-2">
                <UserPlus size={18} /> Invite
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 p-12 bg-eco-green rounded-organic text-white text-center relative overflow-hidden">
        <Heart className="absolute top-0 right-0 text-white/10 w-48 h-48 -mr-10 -mt-10" />
        <h4 className="text-2xl font-display font-extrabold mb-4 relative z-10">Safe Sprouting Community</h4>
        <p className="text-white/80 font-sans max-w-lg mx-auto relative z-10">All explorers in our garden are verified. Travel with peace of mind knowing you're in kind company.</p>
      </div>
    </div>
  );
};