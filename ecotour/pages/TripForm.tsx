import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronLeft, MapPin, Calendar, Wallet, Compass, AlertCircle } from 'lucide-react';
import { TripDetails } from '../types';

export const TripForm: React.FC<{ onSubmit: (d: TripDetails) => void }> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<TripDetails>({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'Modest',
    groupTravel: false,
    travelPace: 'relaxed'
  });
  const [dateErrors, setDateErrors] = useState<{ start?: string; end?: string }>({});

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  // Validate dates
  const validateDates = (startDate: string, endDate: string): { start?: string; end?: string } => {
    const errors: { start?: string; end?: string } = {};
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      if (start < todayDate) {
        errors.start = 'Departure date cannot be in the past';
      }
    }

    if (endDate) {
      const end = new Date(endDate);
      if (end < todayDate) {
        errors.end = 'Return date cannot be in the past';
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        errors.end = 'Return date must be after departure date';
      }
    }

    return errors;
  };

  const handleStartDateChange = (value: string) => {
    const newForm = { ...form, startDate: value };
    // If end date is before new start date, clear it
    if (form.endDate && new Date(form.endDate) <= new Date(value)) {
      newForm.endDate = '';
    }
    setForm(newForm);
    setDateErrors(validateDates(value, newForm.endDate));
  };

  const handleEndDateChange = (value: string) => {
    setForm({ ...form, endDate: value });
    setDateErrors(validateDates(form.startDate, value));
  };

  const isFormValid = useMemo(() => {
    const errors = validateDates(form.startDate, form.endDate);
    return Object.keys(errors).length === 0 && form.startDate && form.endDate;
  }, [form.startDate, form.endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateDates(form.startDate, form.endDate);
    if (Object.keys(errors).length > 0) {
      setDateErrors(errors);
      return;
    }
    onSubmit(form);
    navigate('/results');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <button onClick={() => navigate('/impact-question')} className="flex items-center font-sans font-bold text-gray-400 dark:text-gray-500 hover:text-eco-green transition-colors mb-12">
        <ChevronLeft className="w-5 h-5 mr-1" /> Impact Choices
      </button>

      <div className="organic-card p-10 md:p-16">
        <div className="flex items-center space-x-4 mb-12">
          <div className="p-4 bg-eco-green rounded-full text-white shadow-lg shadow-eco-green/20">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Where next?</h2>
            <p className="font-sans text-gray-500 dark:text-gray-400">Tell us about your upcoming sprout journey.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <MapPin size={16} className="text-eco-green" /> Home Town
              </label>
              <input 
                required 
                type="text" 
                placeholder="Where are you starting?" 
                value={form.origin} 
                onChange={e => setForm({ ...form, origin: e.target.value })}
                className="w-full bg-eco-beige dark:bg-eco-dark/50 dark:text-white border-none rounded-soft p-5 font-sans font-semibold focus:ring-2 focus:ring-eco-green transition-all placeholder-gray-400 dark:placeholder-gray-600" 
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <MapPin size={16} className="text-eco-green" /> Dream Spot
              </label>
              <input 
                required 
                type="text" 
                placeholder="Where should we go?" 
                value={form.destination} 
                onChange={e => setForm({ ...form, destination: e.target.value })}
                className="w-full bg-eco-beige dark:bg-eco-dark/50 dark:text-white border-none rounded-soft p-5 font-sans font-semibold focus:ring-2 focus:ring-eco-green transition-all placeholder-gray-400 dark:placeholder-gray-600" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <Calendar size={16} className="text-eco-green" /> Departure
              </label>
              <input 
                required 
                type="date" 
                min={today}
                value={form.startDate} 
                onChange={e => handleStartDateChange(e.target.value)}
                className={`w-full bg-eco-beige dark:bg-eco-dark/50 dark:text-white border-2 rounded-soft p-5 font-sans font-semibold focus:ring-2 focus:ring-eco-green transition-all ${dateErrors.start ? 'border-red-400 dark:border-red-500' : 'border-transparent'}`} 
              />
              {dateErrors.start && (
                <p className="flex items-center gap-2 text-red-500 text-sm font-semibold">
                  <AlertCircle size={14} /> {dateErrors.start}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <Calendar size={16} className="text-eco-green" /> Returning
              </label>
              <input 
                required 
                type="date" 
                min={form.startDate || today}
                value={form.endDate} 
                onChange={e => handleEndDateChange(e.target.value)}
                className={`w-full bg-eco-beige dark:bg-eco-dark/50 dark:text-white border-2 rounded-soft p-5 font-sans font-semibold focus:ring-2 focus:ring-eco-green transition-all ${dateErrors.end ? 'border-red-400 dark:border-red-500' : 'border-transparent'}`} 
              />
              {dateErrors.end && (
                <p className="flex items-center gap-2 text-red-500 text-sm font-semibold">
                  <AlertCircle size={14} /> {dateErrors.end}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <Wallet size={16} className="text-eco-green" /> Budget Style
              </label>
              <div className="flex gap-4">
                {['Modest', 'Eco-Luxury'].map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setForm({...form, budget: tier})}
                    className={`flex-1 py-4 rounded-soft font-display font-bold text-sm tracking-widest uppercase transition-all ${form.budget === tier ? 'bg-eco-green text-white shadow-lg' : 'bg-eco-beige dark:bg-eco-dark/50 text-gray-400 dark:text-gray-500 hover:text-eco-green dark:hover:text-eco-green'}`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-eco-beige dark:bg-eco-dark/50 rounded-soft">
               <div>
                 <span className="font-display font-bold text-gray-800 dark:text-gray-100 block">Party Mode</span>
                 <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-tighter">Travel with others</span>
               </div>
               <button
                type="button"
                onClick={() => setForm({...form, groupTravel: !form.groupTravel})}
                className={`w-14 h-8 rounded-full transition-all relative ${form.groupTravel ? 'bg-eco-green' : 'bg-gray-300 dark:bg-gray-600'}`}
               >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${form.groupTravel ? 'right-1' : 'left-1'}`}></div>
               </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!isFormValid}
            className={`w-full py-8 rounded-soft font-display font-bold text-xl shadow-2xl flex items-center justify-center gap-4 transition-all ${
              isFormValid 
                ? 'bg-eco-green text-white shadow-eco-green/30 btn-grow cursor-pointer' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Create My Sprout Plan <Sparkles size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};