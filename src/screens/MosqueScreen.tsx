import React, { useEffect, useState, useCallback } from 'react';
import LocationService from '../services/locationService';
import './MosqueScreen.css';

interface Mosque {
  id: string;
  name: string;
  address: string;
  distance: number;
}

const MosqueScreen: React.FC = () => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const GOOGLE_API_KEY = 'AIzaSyDYF4HFEefrlQMuswHoefQDU-DawWBatDI';

  const toRad = (value: number) => (value * Math.PI) / 180;
  const haversineKm = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  const openMaps = (name: string, address: string) => {
    const query = encodeURIComponent(`${name} ${address}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
  };

  const openRoute = (name: string, address: string) => {
    const query = encodeURIComponent(`${name} ${address}`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    (async () => {
      setError('');
      setLoading(true);
      try {
        const locationService = LocationService.getInstance();
        const userLocation = await locationService.getUserLocation();
        
        if (!userLocation) {
          setError('Location permission denied');
          setLoading(false);
          return;
        }

        const { latitude, longitude } = userLocation;
        setCity(userLocation.city || '');

        // Google Places Nearby Search for mosques within 5km
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&keyword=mosque&opennow=true&key=${GOOGLE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.status !== 'OK' && !data.results) {
          throw new Error(data.error_message || data.status || 'Failed to load nearby mosques');
        }
        
        const list: Mosque[] = (data.results || []).slice(0, 20).map((r: any) => ({
          id: r.place_id,
          name: r.name,
          address: r.vicinity || r.formatted_address || '',
          distance: r.geometry?.location ? haversineKm(latitude, longitude, r.geometry.location.lat, r.geometry.location.lng) : 0,
        })).sort((a: Mosque, b: Mosque) => a.distance - b.distance);
        
        setMosques(list);
      } catch (e: any) {
        setError(e?.message || 'Unable to fetch nearby mosques');
      } finally {
        setLoading(false);
      }
    })();
  }, [haversineKm]);

  return (
    <div className="mosque-container">
      <div className="mosque-header">
        <h1 className="mosque-header-title">Mosque Locator</h1>
        <p className="mosque-header-subtitle">Nearby in {city || 'your area'}</p>
      </div>

      {loading ? (
        <div className="mosque-loading">
          <div className="mosque-spinner"></div>
          <p className="mosque-loading-text">Searching nearby mosques...</p>
        </div>
      ) : (
        <div className="mosque-list">
          {mosques.length === 0 ? (
            <p className="mosque-empty">{error || 'No mosques found nearby.'}</p>
          ) : (
            mosques.map((item) => (
              <div key={item.id} className="mosque-card">
                <div className="mosque-card-header">
                  <h3 className="mosque-name">{item.name}</h3>
                  <div className="mosque-distance">
                    <span>🧭</span>
                    <span>{item.distance.toFixed(1)} km</span>
                  </div>
                </div>
                <p className="mosque-address">{item.address}</p>
                <div className="mosque-row">
                  <button className="mosque-btn-small" onClick={() => openMaps(item.name, item.address)}>
                    <span>🗺️</span>
                    <span>Map</span>
                  </button>
                  <button className="mosque-btn-small mosque-btn-route" onClick={() => openRoute(item.name, item.address)}>
                    <span>🧭</span>
                    <span>Route</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MosqueScreen;

