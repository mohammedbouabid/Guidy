import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/components/ui/card';

// Leaflet CSS and JS loaded via CDN
const LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
const LEAFLET_JS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';

export default function DestinationsMap({ places = [], startLocation, endLocation }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leafletReady, setLeafletReady] = useState(false);

  // Load Leaflet library
  useEffect(() => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
  
    if (window.L) {
      setLeafletReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => setLeafletReady(true);
    script.onerror = () => {
      setError('Failed to load map library');
      setLoading(false);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current) return;

    const timer = setTimeout(() => {
      initMap();
    }, 100);

    // Prevent auto-focus when component mounts
    if (mapContainerRef.current) {
      mapContainerRef.current.blur();
      document.activeElement?.blur();
    }

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error('Error removing map:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [leafletReady]);

  // Update markers
  useEffect(() => {
    if (mapInstanceRef.current && places.length > 0) {
      updateMapMarkers();
    }
  }, [places, startLocation, endLocation]);

  const geocodeLocation = async (city, country) => {
    try {
      const query = encodeURIComponent(`${city}, ${country}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
        { headers: { 'User-Agent': 'PackDetailsApp' } }
      );
      if (!response.ok) throw new Error('Geocoding request failed');
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  const initMap = () => {
    if (!window.L || !mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = window.L.map(mapContainerRef.current, {
        center: [31.7917, -7.0926],
        zoom: 6,
        scrollWheelZoom: true,
        zoomControl: true,
        keyboard: false, // Disable keyboard navigation
        scrollWheelZoom: true
      });

      // Prevent auto-focus
      map.getContainer().setAttribute('tabindex', '-1');
      map.getContainer().blur();
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setLoading(false);
      setError(null);

      if (places.length > 0) {
        setTimeout(() => updateMapMarkers(), 500);
      }
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map: ' + err.message);
      setLoading(false);
    }
  };

  const updateMapMarkers = async () => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    try {
      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          map.removeLayer(layer);
        }
      });

      const bounds = [];

      // Group places by city
      const placesByLocation = {};
      for (const place of places) {
        if (!place.city || !place.country) continue;
        const key = `${place.city}, ${place.country}`;
        if (!placesByLocation[key]) placesByLocation[key] = [];
        placesByLocation[key].push(place);
      }

      // Add markers
      for (const [locationKey, locationPlaces] of Object.entries(placesByLocation)) {
        const [city, country] = locationKey.split(', ');
        const coords = await geocodeLocation(city, country);

        if (coords) {
          locationPlaces.forEach((place, idx) => {
            const offset = idx * 0.002;
            const lat = coords.lat + (idx % 2 === 0 ? offset : -offset);
            const lng = coords.lng + (idx < locationPlaces.length / 2 ? offset : -offset);

            bounds.push([lat, lng]);

            const markerIcon = window.L.divIcon({
              className: 'custom-marker-destination',
              html: `<div style="background-color: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

            const marker = window.L.marker([lat, lng], { icon: markerIcon }).addTo(map);
            marker.bindPopup(`<div><strong>${place.name}</strong><br/>${place.city}, ${place.country}</div>`);
          });
        }
      }

      // Fit map to bounds
      if (bounds.length > 0) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12,
          animate: false,
          pan: { animate: false }
        });

        // Prevent scroll jump
        map.once('moveend', () => {


          if (map.getContainer()) {
            map.getContainer().blur();
          }
        });
      }
    } catch (err) {
      console.error('Error updating markers:', err);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500 text-center">{error}</p>
          <p className="text-sm text-gray-500 text-center mt-2">Please refresh the page to try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#05073c]">Tour Map</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative z-0">
          <div
            ref={mapContainerRef}
            tabIndex="-1"   // 👈 prevents auto-focus
            style={{ height: '500px', width: '100%', borderRadius: '8px', backgroundColor: '#e5e7eb', zIndex: 0 }}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-[1000]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05073c] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
