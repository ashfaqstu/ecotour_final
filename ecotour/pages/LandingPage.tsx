import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, MapPin, Heart, Wind, Flower } from 'lucide-react';

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="organic-card p-8 flex flex-col items-center text-center relative z-10 bg-white/90 dark:bg-eco-dark-surface/90 backdrop-blur-sm">
    <div className="w-14 h-14 bg-eco-green-light dark:bg-eco-green/20 rounded-2xl flex items-center justify-center text-eco-green mb-6">
      {icon}
    </div>
    <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="font-sans text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative pt-10 px-6 max-w-7xl mx-auto">
      {/* Hero Section Container */}
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-20 overflow-visible">
        
        {/* Background Misty Image Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="relative w-full h-full overflow-hidden rounded-organic">
            <img 
              src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover opacity-40 dark:opacity-30 grayscale-[20%] mix-blend-multiply transition-opacity duration-700"
              alt="Nature adventure background"
            />
            {/* Misty Fades */}
            <div className="absolute inset-0 bg-gradient-to-b from-eco-beige via-transparent to-eco-beige dark:from-eco-dark dark:to-eco-dark"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-eco-beige via-transparent to-eco-beige dark:from-eco-dark dark:to-eco-dark"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-8 text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1 bg-white/80 dark:bg-eco-dark-surface/80 backdrop-blur-sm border border-eco-green/10 dark:border-white/10 rounded-full text-eco-green font-bold text-xs uppercase tracking-widest shadow-sm">
            <Flower size={14} />
            <span>Sprouting Adventures</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-extrabold text-gray-900 dark:text-white leading-[1.05] tracking-tight">
            Travel with <br/> 
            <span className="text-eco-green font-handwritten text-7xl md:text-9xl lowercase -rotate-2 inline-block drop-shadow-sm">Kindness</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-sans leading-relaxed font-medium">
            Discover breathtaking destinations and support local communities. Every journey you take can help our planet bloom.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button 
              onClick={() => navigate('/impact-question')}
              className="w-full sm:w-auto bg-eco-green text-white px-12 py-6 rounded-full font-display font-bold text-xl shadow-2xl shadow-eco-green/40 btn-grow flex items-center justify-center gap-3"
            >
              Start Planning <ArrowRight size={24} />
            </button>
            <button className="px-10 py-5 rounded-full font-sans font-bold text-gray-600 dark:text-gray-300 hover:text-eco-green transition-colors bg-white/40 dark:bg-eco-dark-surface/40 backdrop-blur-sm dark:border dark:border-white/10">
              Our Mission
            </button>
          </div>
        </div>

        {/* Floating Impact Card */}
        <div className="absolute -bottom-6 right-0 z-20 organic-card p-6 w-64 hidden lg:block transform rotate-2">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-eco-green rounded-full flex items-center justify-center text-white">
              <Heart size={20} />
            </div>
            <span className="font-display font-bold text-eco-green">1.2k Trees Saved</span>
          </div>
          <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">Global Impact Score</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-32 relative z-10">
        <FeatureItem 
          icon={<Wind size={24} />} 
          title="Air-First Paths" 
          desc="Routes optimized for the lowest carbon footprint, favoring trains and shared EVs." 
        />
        <FeatureItem 
          icon={<Heart size={24} />} 
          title="Rooted Stays" 
          desc="Hand-picked homestays and family-owned lodges that pour love back into the land." 
        />
        <FeatureItem 
          icon={<MapPin size={24} />} 
          title="Quiet Gems" 
          desc="Avoid the crowds and discover secret spots where nature is still the loudest sound." 
        />
      </div>
    </div>
  );
};