import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateItineraries } from '../services/geminiService';
import { TripDetails, SustainabilityPrefs, Itinerary } from '../types';
import { Loader2, ArrowRight, Sprout, Wind, Users, Bird } from 'lucide-react';

export const ResultsPage: React.FC<{ 
  details: TripDetails; 
  prefs: SustainabilityPrefs;
  onSelect: (it: Itinerary) => void;
}> = ({ details, prefs, onSelect }) => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const results = await generateItineraries(details, prefs);
        setItineraries(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [details, prefs]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-12 space-y-12">
        <div className="relative w-32 h-32">
          <Loader2 className="w-full h-full text-eco-green/20 animate-spin" strokeWidth={1} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sprout size={48} className="text-eco-green animate-bounce" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-2">Cultivating Plans...</h3>
          <p className="font-sans text-gray-500 dark:text-gray-400 animate-pulse">Growing the best routes for your {details.destination} trip.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="mb-20 text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white">Your Bloom Plans</h2>
        <p className="font-sans text-lg text-gray-500 dark:text-gray-400">We've found 3 kind ways for you to explore the world.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {itineraries.map((it, idx) => (
          <div 
            key={it.id} 
            className="organic-card flex flex-col h-full group overflow-hidden"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
               <img 
                 src={`https://images.unsplash.com/photo-${1500000000000 + idx}?auto=format&fit=crop&q=80&w=800`} 
                 alt={it.title} 
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
               />
               <div className="absolute top-4 right-4 bg-white/90 dark:bg-eco-dark-surface/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                  <span className="font-display font-bold text-eco-green flex items-center gap-1">
                    <Sprout size={16} /> {it.totalScore}
                  </span>
               </div>
            </div>

            <div className="p-8 flex-grow flex flex-col space-y-6">
              <div>
                <h3 className="font-display text-xl font-extrabold text-gray-800 dark:text-white group-hover:text-eco-green transition-colors">{it.title}</h3>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2">{it.transportMode} • {it.accommodationType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                  <Wind size={14} className="text-eco-green" /> Carbon: {it.breakdown.carbon}%
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                  <Users size={14} className="text-eco-green" /> Local: {it.breakdown.community}%
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed line-clamp-2">
                "{it.explanation}"
              </p>

              <button 
                onClick={() => { onSelect(it); navigate('/details'); }}
                className="mt-auto w-full py-4 rounded-soft bg-eco-green-light dark:bg-eco-green/10 text-eco-green font-display font-bold transition-all hover:bg-eco-green hover:text-white flex items-center justify-center gap-2"
              >
                Bloom Details <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};