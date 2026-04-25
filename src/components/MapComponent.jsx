import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom pulsing icon for destination
const pulseIcon = L.divIcon({
  className: 'custom-pulse-icon',
  html: `<div class="pulse-ring"></div><div class="pulse-dot"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const center = [14.5995, 120.9842]; // Manila
const mockDest = [14.5547, 121.0244]; // Makati

const MapComponent = ({ trafficLevel, destination }) => {
  const [cars, setCars] = useState([]);

  // Generate some "live" traffic dots
  useEffect(() => {
    const initialCars = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      pos: [
        center[0] + (Math.random() - 0.5) * 0.05,
        center[1] + (Math.random() - 0.5) * 0.05
      ],
      speed: 0.0001 + Math.random() * 0.0002
    }));
    setCars(initialCars);

    const interval = setInterval(() => {
      setCars(prev => prev.map(car => ({
        ...car,
        pos: [car.pos[0] + car.speed, car.pos[1] + car.speed]
      })));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getTrafficColor = () => {
    switch (trafficLevel) {
      case 'heavy': return '#ef4444';
      case 'moderate': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
      <MapContainer 
        center={center} 
        zoom={14} 
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Live Traffic Simulation */}
        {cars.map(car => (
          <CircleMarker 
            key={car.id}
            center={car.pos}
            radius={2}
            pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.8, color: 'transparent' }}
          />
        ))}

        {/* Current Location */}
        <CircleMarker 
          center={center} 
          radius={8}
          pathOptions={{ fillColor: '#3b82f6', fillOpacity: 1, color: '#fff', weight: 2 }}
        />

        {/* Destination Pin */}
        {destination && (
          <>
            <Marker position={mockDest} icon={pulseIcon} />
            <Polyline 
              positions={[center, mockDest]} 
              pathOptions={{ 
                color: getTrafficColor(), 
                weight: 6,
                opacity: 0.8,
                dashArray: '10, 10',
                lineCap: 'round'
              }} 
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
