'use client';

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPos?: [number, number];
}

function MapTouchHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPos({ pos }: { pos: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(pos, 14, { duration: 1.5 });
  }, [pos, map]);
  return null;
}

export default function LocationPickerMap({ onLocationSelect, initialPos = [22.5726, 88.3639] }: LocationPickerMapProps) {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  const handleSelect = (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-primary/20 relative shadow-inner">
      <MapContainer 
        center={initialPos} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapTouchHandler onLocationSelect={handleSelect} />
        {markerPos && <Marker position={markerPos} />}
        {markerPos && <FlyToPos pos={markerPos} />}
        
        {/* Help Overlay */}
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-primary/20 pointer-events-none transition-all animate-fade-in">
           <p className="text-[0.65rem] font-black uppercase tracking-widest text-primary dark:text-white flex items-center gap-2">
             <span className="material-symbols-outlined text-sm text-india-saffron">touch_app</span>
             Click Map to Set Hub
           </p>
        </div>
      </MapContainer>
    </div>
  );
}
