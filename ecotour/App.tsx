import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BackendConnectionOverlay } from './components/BackendConnectionOverlay';
import { LandingPage } from './pages/LandingPage';
import { ImpactQuestion } from './pages/ImpactQuestion';
import { TripForm } from './pages/TripForm';
import { ResultsPage } from './pages/ResultsPage';
import { DetailsPage } from './pages/DetailsPage';
import { GroupMatchingPage } from './pages/GroupMatchingPage';
import { SustainabilityPrefs, TripDetails, Itinerary } from './types';

const App: React.FC = () => {
  const [prefs, setPrefs] = useState<SustainabilityPrefs | null>(null);
  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showConnectionOverlay, setShowConnectionOverlay] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleConnected = () => {
    setShowConnectionOverlay(false);
    setIsDemo(false);
  };

  const handleFallback = () => {
    setShowConnectionOverlay(false);
    setIsDemo(true);
  };

  return (
    <div className="app-canvas w-full min-h-[90vh] flex flex-col shadow-2xl transition-all duration-300">
      {showConnectionOverlay && (
        <BackendConnectionOverlay
          onConnected={handleConnected}
          onFallback={handleFallback}
        />
      )}
      <HashRouter>
        <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/impact-question" 
              element={<ImpactQuestion setPrefs={setPrefs} />} 
            />
            <Route 
              path="/trip-form" 
              element={<TripForm onSubmit={setTrip} />} 
            />
            <Route 
              path="/results" 
              element={
                (prefs && trip) 
                  ? <ResultsPage prefs={prefs} details={trip} onSelect={setSelectedItinerary} /> 
                  : <Navigate to="/" />
              } 
            />
            <Route 
              path="/details" 
              element={
                (selectedItinerary && trip) 
                  ? <DetailsPage itinerary={selectedItinerary} trip={trip} /> 
                  : <Navigate to="/" />
              } 
            />
            <Route path="/group-matching" element={
              <GroupMatchingPage 
                trip={trip} 
                prefs={prefs} 
              />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </HashRouter>
    </div>
  );
};

export default App;