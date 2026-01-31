import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, Users, Bird, MapPin, ChevronLeft, Sprout } from 'lucide-react';

interface SliderProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (val: number) => void;
  desc: string;
}

const ImpactSlider: React.FC<SliderProps> = ({ label, icon, value, onChange, desc }) => (
  <div className="organic-card p-8 space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-eco-green-light dark:bg-eco-green/20 text-eco-green rounded-2xl">
          {icon}
        </div>
        <div>
          <h4 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100">{label}</h4>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{desc}</p>
        </div>
      </div>
      <div className="text-3xl font-display font-bold text-eco-green">{value}%</div>
    </div>
    
    <div className="relative py-2">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  </div>
);

export const ImpactQuestion: React.FC<{ setPrefs: (p: any) => void }> = ({ setPrefs }) => {
  const navigate = useNavigate();
  const [carbon, setCarbon] = useState(80);
  const [community, setCommunity] = useState(60);
  const [biodiversity, setBiodiversity] = useState(70);
  const [overtourism, setOvertourism] = useState(50);

  const handleSubmit = () => {
    setPrefs({ carbon, community, biodiversity, overtourism });
    navigate('/trip-form');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <button onClick={() => navigate('/')} className="flex items-center font-sans font-bold text-gray-400 dark:text-gray-500 hover:text-eco-green transition-colors mb-12">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back
      </button>

      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-gray-900 dark:text-white leading-tight">
          How do you want to <br/> <span className="text-eco-green">help today?</span>
        </h2>
        <p className="font-sans text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Every travel priority you set helps us cultivate the perfect itinerary that balances your adventure with the planet's needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImpactSlider 
          label="Carbon Care" 
          icon={<Wind size={20} />} 
          value={carbon} 
          onChange={setCarbon} 
          desc="Prioritize clean transport" 
        />
        <ImpactSlider 
          label="Village Support" 
          icon={<Users size={20} />} 
          value={community} 
          onChange={setCommunity} 
          desc="Boost local families" 
        />
        <ImpactSlider 
          label="Wild Defense" 
          icon={<Bird size={20} />} 
          value={biodiversity} 
          onChange={setBiodiversity} 
          desc="Protect fragile biomes" 
        />
        <ImpactSlider 
          label="Quiet Escape" 
          icon={<MapPin size={20} />} 
          value={overtourism} 
          onChange={setOvertourism} 
          desc="Avoid crowded sites" 
        />
      </div>

      <div className="mt-16 flex justify-center">
        <button 
          onClick={handleSubmit} 
          className="bg-eco-green text-white px-16 py-6 rounded-full font-display font-bold text-xl shadow-2xl shadow-eco-green/30 btn-grow flex items-center gap-3"
        >
          Let's Bloom <Sprout size={24} />
        </button>
      </div>
    </div>
  );
};