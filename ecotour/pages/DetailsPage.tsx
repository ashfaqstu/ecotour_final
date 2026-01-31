import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Itinerary, TripDetails } from '../types';
import { ChevronLeft, MapPin, Calendar, Leaf, Train, Home, Info, Sparkles, Sprout } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DetailsPage: React.FC<{ 
  itinerary: Itinerary; 
  trip: TripDetails;
}> = ({ itinerary, trip }) => {
  const navigate = useNavigate();

  const chartData = [
    { name: 'Carbon', score: itinerary.breakdown.carbon, color: '#66b966' },
    { name: 'Local', score: itinerary.breakdown.community, color: '#3b82f6' },
    { name: 'Nature', score: itinerary.breakdown.biodiversity, color: '#f59e0b' },
    { name: 'Flow', score: itinerary.breakdown.overtourism, color: '#8b5cf6' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <button onClick={() => navigate('/results')} className="flex items-center font-sans font-bold text-gray-400 dark:text-gray-500 hover:text-eco-green transition-colors mb-12">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Plans
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-eco-green">
              <Sprout className="w-6 h-6" />
              <span className="font-display font-bold uppercase text-xs tracking-widest">Kind Journey Selected</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white leading-tight">{itinerary.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center px-6 py-3 bg-white dark:bg-eco-dark-surface organic-card shadow-sm text-gray-600 dark:text-gray-300 font-bold">
                <MapPin className="w-4 h-4 mr-2 text-eco-green" /> {trip.destination}
              </div>
              <div className="flex items-center px-6 py-3 bg-white dark:bg-eco-dark-surface organic-card shadow-sm text-gray-600 dark:text-gray-300 font-bold">
                <Calendar className="w-4 h-4 mr-2 text-eco-green" /> {trip.startDate}
              </div>
            </div>
          </div>

          <div className="organic-card p-10 bg-eco-cream dark:bg-eco-dark/30 relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 text-eco-green/10 dark:text-eco-green/5 w-16 h-16" />
            <h3 className="font-display font-bold text-xl text-gray-800 dark:text-white mb-6 flex items-center gap-2">
               Why this blooms <Sprout size={20} className="text-eco-green" />
            </h3>
            <p className="text-lg font-sans italic text-gray-600 dark:text-gray-300 leading-relaxed">
              "{itinerary.explanation}"
            </p>
          </div>

          <div className="space-y-10">
            <h3 className="font-display font-bold text-2xl text-gray-800 dark:text-white">Your Sprout Timeline</h3>
            <div className="relative space-y-12">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-eco-green/10 dark:bg-eco-green/5 hidden md:block"></div>
              
              {itinerary.days.map((day, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-12 h-12 rounded-full bg-eco-green text-white flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-eco-green/20 relative z-10 shrink-0">
                    {day.day}
                  </div>
                  <div className="organic-card p-8 flex-grow">
                    <h4 className="font-display font-bold text-xl text-gray-800 dark:text-white mb-4">{day.activity}</h4>
                    <div className="flex flex-wrap gap-6 text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-6">
                      <span className="flex items-center gap-2"><Train size={14} className="text-eco-green" /> {day.transport}</span>
                      <span className="flex items-center gap-2"><Home size={14} className="text-eco-green" /> {day.accommodation}</span>
                    </div>
                    <div className="p-5 bg-eco-green-light dark:bg-eco-green/10 rounded-soft text-eco-green text-sm font-semibold flex items-start gap-3">
                      <Info className="w-5 h-5 shrink-0 mt-0.5" />
                      {day.sustainabilityNote}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="sticky top-24 space-y-10">
            <div className="organic-card p-10 bg-white dark:bg-eco-dark-surface">
              <div className="text-center mb-10">
                <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full bg-eco-green-light dark:bg-eco-green/20 mb-6 border-4 border-white dark:border-eco-dark shadow-xl">
                  <span className="text-4xl font-display font-black text-eco-green">{itinerary.totalScore}</span>
                  <span className="text-[10px] font-bold text-eco-green uppercase tracking-widest">Kindness</span>
                </div>
                <h4 className="font-display font-bold text-gray-800 dark:text-white">Impact Balance</h4>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" strokeOpacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backgroundColor: '#1a2e22', color: 'white' }} 
                      itemStyle={{ color: 'white' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="score" radius={[10, 10, 10, 10]} barSize={30}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <button 
                onClick={() => trip.groupTravel ? navigate('/group-matching') : alert("Journey confirmed! Happy planting.")}
                className="w-full mt-10 bg-eco-green text-white py-6 rounded-soft font-display font-bold text-xl shadow-2xl shadow-eco-green/30 btn-grow"
              >
                {trip.groupTravel ? 'Find Garden Partners' : 'Confirm Journey'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};