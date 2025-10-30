import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    // Load CSS
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    // Load JS
    if (window.L) {
      setLeafletReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => {
      setLeafletReady(true);
    };
    script.onerror = () => {
      setError('Failed to load map library');
      setLoading(false);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize map when Leaflet is ready
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current) return;

    // Wait a tick to ensure DOM is fully ready
    const timer = setTimeout(() => {
      initMap();
    }, 100);

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

  // Update markers when data changes
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
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
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
      // Create map with default center (Morocco)
      const map = window.L.map(mapContainerRef.current, {
        center: [31.7917, -7.0926],
        zoom: 6,
        scrollWheelZoom: true,
        zoomControl: true
      });

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setLoading(false);
      setError(null);

      // Load markers after map is ready
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

      // Group places by city to handle multiple destinations in same location
      const placesByLocation = {};
      for (const place of places) {
        if (!place.city || !place.country) continue;
        const key = `${place.city}, ${place.country}`;
        if (!placesByLocation[key]) {
          placesByLocation[key] = [];
        }
        placesByLocation[key].push(place);
      }

      // Add markers for each location
      for (const [locationKey, locationPlaces] of Object.entries(placesByLocation)) {
        const [city, country] = locationKey.split(', ');
        const coords = await geocodeLocation(city, country);
        
        if (coords) {
          // Add slight offset for multiple places in same city
          locationPlaces.forEach((place, idx) => {
            const offset = idx * 0.002; // Small offset to prevent exact overlap
            const lat = coords.lat + (idx % 2 === 0 ? offset : -offset);
            const lng = coords.lng + (idx < locationPlaces.length / 2 ? offset : -offset);
            
            bounds.push([lat, lng]);

            // Blue marker for destinations
            const markerIcon = window.L.divIcon({
              className: 'custom-marker-destination',
              html: `<div style="background-color: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

            const marker = window.L.marker([lat, lng], { icon: markerIcon }).addTo(map);

            const popupContent = `
              <div style="min-width: 200px; max-width: 250px;">
                <h3 style="font-weight: bold; margin-bottom: 8px; color: #05073c; font-size: 16px;">${place.name}</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 4px;">${place.city}, ${place.country}</p>
                ${place.images && place.images[0] ? `
                  <img src="${place.images[0]}" alt="${place.name}" 
                    style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-top: 8px;" />
                ` : ''}
                ${place.description ? `
                  <p style="font-size: 13px; color: #444; margin-top: 8px; line-height: 1.4;">
                    ${place.description.substring(0, 100)}${place.description.length > 100 ? '...' : ''}
                  </p>
                ` : ''}
              </div>
            `;
            marker.bindPopup(popupContent, { maxWidth: 300 });
          });
        }
      }

      // Add start location marker (green)
      if (startLocation) {
        const country = places[0]?.country || 'Morocco';
        const startCoords = await geocodeLocation(startLocation, country);
        if (startCoords) {
          bounds.push([startCoords.lat, startCoords.lng]);
          
          const startIcon = window.L.divIcon({
            className: 'custom-marker-start',
            html: `<div style="background-color: #22c55e; width: 38px; height: 38px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">S</div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
          });

          const startMarker = window.L.marker([startCoords.lat, startCoords.lng], { icon: startIcon }).addTo(map);
          startMarker.bindPopup(`<div style="text-align: center; padding: 8px;"><strong style="color: #22c55e; font-size: 16px;">Start Location</strong><br/><span style="color: #666;">${startLocation}</span></div>`);
        }
      }

      // Add end location marker (red)
      if (endLocation) {
        const country = places[places.length - 1]?.country || 'Morocco';
        const endCoords = await geocodeLocation(endLocation, country);
        if (endCoords) {
          bounds.push([endCoords.lat, endCoords.lng]);
          
          const endIcon = window.L.divIcon({
            className: 'custom-marker-end',
            html: `<div style="background-color: #ef4444; width: 38px; height: 38px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">E</div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
          });

          const endMarker = window.L.marker([endCoords.lat, endCoords.lng], { icon: endIcon }).addTo(map);
          endMarker.bindPopup(`<div style="text-align: center; padding: 8px;"><strong style="color: #ef4444; font-size: 16px;">End Location</strong><br/><span style="color: #666;">${endLocation}</span></div>`);
        }
      }

      // Fit map to show all markers with padding
      if (bounds.length > 0) {
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 12 
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
        <div className="flex gap-4 mt-2 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow"></div>
            <span className="text-gray-700">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
            <span className="text-gray-700">Destinations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
            <span className="text-gray-700">End</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative">
          <div
            ref={mapContainerRef}
            style={{ height: '500px', width: '100%', borderRadius: '8px', backgroundColor: '#e5e7eb' }}
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