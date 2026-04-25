import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom pulsing icon for destination
const pulseIcon = L.divIcon({
  className: 'custom-pulse-icon',
  html: `<div class="pulse-ring"></div><div class="pulse-dot"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const DEFAULT_CENTER = [14.5995, 120.9842]; // Manila fallback
const MOCK_DEST_OFFSET = [0.03, 0.04]; // Offset from current location to simulate route

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

const MapComponent = ({ trafficLevel, destination }) => {
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
  const [destPoint, setDestPoint] = useState(null);
  const [routeGeometry, setRouteGeometry] = useState([]);
  const [cars, setCars] = useState([]);

  // Get real location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        null,
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Set destination and fetch real road route
  useEffect(() => {
    if (destination) {
      const dp = [
        userLocation[0] + MOCK_DEST_OFFSET[0],
        userLocation[1] + MOCK_DEST_OFFSET[1]
      ];
      setDestPoint(dp);

      // Fetch from OSRM for real road snapping
      const fetchRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${dp[1]},${dp[0]}?overview=full&geometries=geojson`
          );
          const data = await response.json();
          if (data.routes && data.routes.length > 0) {
            // OSRM returns [lng, lat], Leaflet needs [lat, lng]
            const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRouteGeometry(coords);
          }
        } catch (error) {
          console.error("OSRM Routing Error:", error);
          setRouteGeometry([userLocation, dp]); // Fallback to straight line
        }
      };
      fetchRoute();
    } else {
      setDestPoint(null);
      setRouteGeometry([]);
    }
  }, [destination, userLocation]);

  // Generate "live" traffic dots
  useEffect(() => {
    const initialCars = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      pos: [
        userLocation[0] + (Math.random() - 0.5) * 0.05,
        userLocation[1] + (Math.random() - 0.5) * 0.05
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
  }, [userLocation]);

  const getTrafficColor = () => {
    switch (trafficLevel) {
      case 'heavy': return '#ef4444';
      case 'moderate': return '#f59e0b';
      default: return '#3b82f6'; // Professional blue for clear route
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}>
      <MapContainer 
        center={userLocation} 
        zoom={14} 
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={userLocation} />
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Live Traffic */}
        {cars.map(car => (
          <CircleMarker 
            key={car.id}
            center={car.pos}
            radius={2}
            pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.4, color: 'transparent' }}
          />
        ))}

        {/* Current Location Marker */}
        <CircleMarker 
          center={userLocation} 
          radius={8}
          pathOptions={{ fillColor: '#3b82f6', fillOpacity: 1, color: '#fff', weight: 2 }}
        />

        {/* Road-Snapped Route */}
        {routeGeometry.length > 0 && (
          <>
            {/* Route Outer Casing */}
            <Polyline 
              positions={routeGeometry} 
              pathOptions={{ 
                color: '#fff', 
                weight: 10,
                opacity: 0.5,
                lineCap: 'round'
              }} 
            />
            {/* Main Route Line */}
            <Polyline 
              positions={routeGeometry} 
              pathOptions={{ 
                color: getTrafficColor(), 
                weight: 6,
                opacity: 1,
                lineCap: 'round'
              }} 
            />
          </>
        )}

        {/* Destination Pin */}
        {destPoint && <Marker position={destPoint} icon={pulseIcon} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
