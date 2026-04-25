import React, { useState } from 'react';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchPanel = ({ onSetDestination, isCommuting, destination, status }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSetDestination(input);
    }
  };

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="glass premium-shadow"
      style={{ width: 380, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: 10, background: 'rgba(59, 130, 246, 0.2)', borderRadius: 12 }}>
          <Navigation size={24} color="var(--primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>TrapikoSenseKo</h2>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Ready to beat the traffic?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#6b7280" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Where to?" 
            value={status !== 'idle' ? destination : input}
            onChange={(e) => setInput(e.target.value)}
            style={{ paddingLeft: 44 }}
            disabled={status !== 'idle'}
          />
        </div>
        
        {status === 'idle' ? (
          <button 
            type="submit"
            style={{ 
              background: 'var(--primary)', 
              color: '#fff', 
              padding: '12px', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            Start Commute
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' }}>
            <MapPin size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem' }}>Heading to <b style={{ color: '#fff' }}>{destination}</b></span>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default SearchPanel;
