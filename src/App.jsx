import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import SearchPanel from './components/SearchPanel';
import SuggestionPanel from './components/SuggestionPanel';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Navigation, Clock } from 'lucide-react';
import './App.css';

function App() {
  const [destination, setDestination] = useState('');
  const [isTrafficDetected, setIsTrafficDetected] = useState(false);
  const [isCommuting, setIsCommuting] = useState(false);
  const [trafficLevel, setTrafficLevel] = useState('light'); 
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Simulate Traffic Detection Logic
  useEffect(() => {
    if (isCommuting && !isTrafficDetected) {
      const timer = setTimeout(() => {
        setTrafficLevel('heavy');
        setIsTrafficDetected(true);
        setShowSuggestions(true);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [isCommuting, isTrafficDetected]);

  const handleSetDestination = (dest) => {
    setDestination(dest);
    setIsCommuting(true);
    setTrafficLevel('light');
    setIsTrafficDetected(false);
    setShowSuggestions(false);
  };

  return (
    <div className="app-container">
      <MapComponent 
        trafficLevel={trafficLevel} 
        destination={destination} 
      />
      
      <div className="ui-layer">
        <SearchPanel 
          onSetDestination={handleSetDestination} 
          isCommuting={isCommuting} 
          destination={destination}
          status={isCommuting ? 'commuting' : 'idle'}
        />

        <AnimatePresence>
          {isTrafficDetected && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="traffic-alert-banner glass traffic-alert-pulse"
            >
              <AlertCircle size={20} color="var(--danger)" />
              <span>Heavy traffic detected on your route! Faster options available.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <SuggestionPanel 
          visible={showSuggestions} 
          onClose={() => setShowSuggestions(false)} 
        />
      </div>

      {isCommuting && !isTrafficDetected && (
        <div className="status-indicator glass">
          <Clock size={16} />
          <span>Monitoring route conditions...</span>
        </div>
      )}
    </div>
  );
}

export default App;
