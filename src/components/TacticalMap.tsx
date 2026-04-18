'use client';

import { useState, useEffect } from 'react';
import { Loader } from './Loader';

interface TacticalMapProps {
  data: any;
  title?: string;
}

export default function TacticalMap({ data, title = 'Tactical Deployment' }: TacticalMapProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buildMap = () => {
      if (!data) {
        setIsLoading(false);
        return;
      }
      const builtHtml = buildMultiLayerMap(data, title);
      setHtmlContent(builtHtml);
      setIsLoading(false);
    };
    buildMap();
  }, [data, title]);

  if (isLoading) return <div className="h-full flex items-center justify-center"><Loader message="Generating tactical grid..." /></div>;

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col">
      {htmlContent ? (
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-none block"
          title="Simulation Map"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : (
         <div className="h-full flex flex-col items-center justify-center text-slate-500">
           <span className="material-symbols-outlined text-4xl mb-2">map</span>
           <p className="text-xs font-bold uppercase tracking-widest">No mapping data available for this view</p>
         </div>
      )}
    </div>
  );
}

// Full Robust Map Building Logic from MapOverlay
function buildMultiLayerMap(jsonData: any, title: string): string {
  if (!jsonData) return '';
  // Extract time_periods from any nested structure
  let timePeriods = jsonData.time_periods;
  
  // Case 1: Single Prediction Object (Flat)
  if (!timePeriods && jsonData.risk_profile) {
    const pred = jsonData;
    timePeriods = {
      "Current Analysis": {
        "zones": [{
          "centroid": [pred.latitude, pred.longitude],
          "risk_level": pred.risk_profile?.level || 'High',
          "zone_name": pred.zone_name || 'Analysis Hub'
        }],
        "ambulances": []
      }
    };
  }
  
  // Case 2: History Array
  else if (!timePeriods && jsonData.prediction_history?.[0]?.risk_profile) {
    const pred = jsonData.prediction_history[0];
    timePeriods = {
      "History Point": {
        "zones": [{
          "centroid": [pred.latitude, pred.longitude],
          "risk_level": pred.risk_profile?.level || 'High',
          "zone_name": pred.zone_name || 'Historical Hub'
        }],
        "ambulances": []
      }
    };
  }

  if (!timePeriods) return '';

  const periods = Object.keys(timePeriods);
  const getLL = (item: any): [number, number] | null => {
    if (!item) return null;
    const lat = item.lat ?? item.latitude ?? item.LATITUDE ?? item.center_lat ?? item.centroid_lat;
    const lng = item.lng ?? item.longitude ?? item.LONGITUDE ?? item.center_lon ?? item.centroid_lon;
    if (lat != null && lng != null) return [parseFloat(lat), parseFloat(lng)];
    const c = item.center || item.centroid;
    if (Array.isArray(c) && c.length >= 2) return [parseFloat(c[0]), parseFloat(c[1])];
    return null;
  };

  let firstPos: [number, number] = [22.5726, 88.3639];
  for (const p of periods) {
    const zones = timePeriods[p].zones || [];
    if (zones.length > 0) { const ll = getLL(zones[0]); if (ll) { firstPos = ll; break; } }
  }

  let layerJs = '';
  let layerMapEntries = '';

  periods.forEach((period, idx) => {
    const data = timePeriods[period];
    const groupVar = `group_${period.toLowerCase().replace(/\s/g, '_')}_${idx}`;
    const zones = data.zones || [];
    const ambulances = data.selected_ambulances || data.ambulances || [];
    
    layerJs += `var ${groupVar} = L.featureGroup().addTo(map);\n`;
    
    zones.forEach((z: any, zi: number) => {
      const centroid = getLL(z.centroid || z);
      if (!centroid) return;
      
      const r_val = (z.risk_level || '').toString().toLowerCase();
      let color = 'green';
      if (r_val.includes('red') || r_val.includes('high')) color = 'red';
      else if (r_val.includes('orange') || r_val.includes('med')) color = 'orange';

      // Reconstruct polygon if directional points exist
      const cyclicKeys = ['north', 'north_east', 'east', 'south_east', 'south', 'south_west', 'west', 'north_west'];
      const dirPts = z.directional_points || {};
      let polyPoints: [number, number][] = [];
      if (Object.keys(dirPts).length > 0) {
        polyPoints = cyclicKeys
          .map(k => dirPts[k])
          .filter(p => p && p.lat != null)
          .map(p => [parseFloat(p.lat), parseFloat(p.lng || p.lon)]);
      } else if (Array.isArray(z.boundary_points)) {
        polyPoints = z.boundary_points.map((p: any) => [parseFloat(p.lat || p[0]), parseFloat(p.lng || p[1])]);
      }

      const label = z.zone_name || z.zone_id || `Zone ${zi + 1}`;
      if (polyPoints.length > 0) {
        layerJs += `L.polygon(${JSON.stringify(polyPoints)}, { color: "${color}", fillColor: "${color}", fillOpacity: 0.3, weight: 2 }).bindTooltip("${label}", { permanent: true, direction: 'center', className: 'zone-label' }).addTo(${groupVar});\n`;
      } else {
        // Octagon Hexagon Fallback
        layerJs += `L.circleMarker([${centroid[0]}, ${centroid[1]}], { radius: 15, color: "${color}", fillColor: "${color}", fillOpacity: 0.5 }).bindTooltip("${label}", { permanent: true, direction: 'center', className: 'zone-label' }).addTo(${groupVar});\n`;
      }
      
      layerJs += `L.marker([${centroid[0]}, ${centroid[1]}], { icon: L.AwesomeMarkers.icon({ markerColor: "${color}", iconColor: "white", icon: "warning-sign", prefix: "glyphicon" }) }).addTo(${groupVar});\n`;
    });

    ambulances.forEach((a: any, ai: number) => {
      const pos = getLL(a);
      if (!pos) return;
      layerJs += `L.marker([${pos[0]}, ${pos[1]}], { icon: L.AwesomeMarkers.icon({ markerColor: "blue", iconColor: "white", icon: "plus-sign", prefix: "glyphicon" }) }).addTo(${groupVar});\n`;
      layerJs += `L.circle([${pos[0]}, ${pos[1]}], { radius: 5360, color: "blue", fill: false, opacity: 0.2, weight: 2 }).addTo(${groupVar});\n`;
    });

    layerMapEntries += `"${period}": ${groupVar},\n`;
  });

  return `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.css"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css"/>
  <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css"/>
  <style>
    html,body,#map{width:100%;height:100%;margin:0;padding:0;background:#111;}
    .zone-label{background:transparent !important;border:none !important;box-shadow:none !important;color:#333;font-weight:900;font-size:10px;text-shadow:1px 1px 0 #fff;}
  </style>
</head><body>
  <div id="map"></div>
  <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js"></script>
  <script>
    var map = L.map('map').setView([${firstPos[0]}, ${firstPos[1]}], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    ${layerJs}
    var overlayLayers = { ${layerMapEntries} };
    L.control.layers(null, overlayLayers, { collapsed: false }).addTo(map);
    var firstLayerName = Object.keys(overlayLayers)[0];
    if (firstLayerName) {
      Object.values(overlayLayers).forEach(function(l){ map.removeLayer(l); });
      map.addLayer(overlayLayers[firstLayerName]);
    }
    setTimeout(function(){ map.invalidateSize(); }, 200);
  </script>
</body></html>`;
}
