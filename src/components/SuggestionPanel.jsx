import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bike, Car, Train, X, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';

const options = [
  { 
    id: 'joyride', 
    name: 'Joyride', 
    time: '12 min', 
    oldTime: '45 min', 
    price: '₱85', 
    icon: Bike, 
    color: '#10b981',
    recommended: true,
    tag: 'FASTER'
  },
  { 
    id: 'angkas', 
    name: 'Angkas', 
    time: '14 min', 
    oldTime: '45 min', 
    price: '₱88', 
    icon: Bike, 
    color: '#3b82f6'
  },
  { 
    id: 'grab', 
    name: 'GrabCar', 
    time: '42 min', 
    oldTime: '45 min', 
    price: '₱240', 
    icon: Car, 
    color: '#9ca3af' 
  },
];

const SuggestionPanel = ({ visible, onClose }) => {
  const [selectedId, setSelectedId] = useState('joyride');
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, booking, confirmed

  const selectedOption = options.find(o => o.id === selectedId);

  const handleBook = () => {
    setBookingStatus('booking');
    setTimeout(() => {
      setBookingStatus('confirmed');
    }, 2000);
  };

  if (bookingStatus === 'confirmed') {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass premium-shadow"
            style={{ 
              position: 'absolute', bottom: 24, right: 24, width: 400, padding: 32,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
              border: '1px solid var(--secondary)'
            }}
          >
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: 20, borderRadius: '50%' }}>
              <CheckCircle2 size={48} color="var(--secondary)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Booked!</h2>
            <p style={{ textAlign: 'center', color: '#9ca3af' }}>Your {selectedOption.name} rider is 3 mins away. Stay safe!</p>
            <button 
              onClick={() => { setBookingStatus('idle'); onClose(); }}
              style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,0.05)', color: '#fff' }}
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="glass premium-shadow"
          style={{ 
            position: 'absolute', 
            bottom: 24, 
            right: 24, 
            width: 400, 
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Fastest Alternatives</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Gridlock detected on EDSA Route</p>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', color: '#6b7280' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {options.map((opt) => (
              <motion.div 
                key={opt.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedId(opt.id)}
                style={{ 
                  padding: 16, 
                  borderRadius: 12, 
                  background: selectedId === opt.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${selectedId === opt.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ 
                  padding: 12, 
                  background: `${opt.color}20`, 
                  borderRadius: 10,
                  color: opt.color
                }}>
                  <opt.icon size={24} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600 }}>{opt.name}</span>
                    {opt.tag && (
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 800, 
                        background: opt.color, 
                        color: '#000', 
                        padding: '2px 6px', 
                        borderRadius: 4 
                      }}>{opt.tag}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{opt.time}</span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', textDecoration: 'line-through' }}>{opt.oldTime}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{opt.price}</div>
                  <ChevronRight size={16} color={selectedId === opt.id ? '#fff' : '#4b5563'} style={{ marginTop: 4 }} />
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={handleBook}
            disabled={bookingStatus === 'booking'}
            style={{ 
              width: '100%', 
              background: 'var(--primary)', 
              color: '#fff', 
              padding: '14px', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              opacity: bookingStatus === 'booking' ? 0.7 : 1
            }}
          >
            {bookingStatus === 'booking' ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Zap size={18} fill="#fff" />
            )}
            {bookingStatus === 'booking' ? 'Booking...' : `Book ${selectedOption.name} Now`}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuggestionPanel;
