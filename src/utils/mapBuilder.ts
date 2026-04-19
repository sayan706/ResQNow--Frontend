// Utility to build a multi-layered Leaflet map matching Folium exactly
// Shared between MapOverlay and PredictWorkflow

export function buildMultiLayerMap(jsonData: any, title: string): string {
  const timePeriods = jsonData.time_periods || {};
  const periods = Object.keys(timePeriods);
  
  const getLL = (item: any): [number, number] | null => {
    if (!item) return null;
    // Check direct keys
    const lat = item.lat ?? item.latitude ?? item.LATITUDE ?? item.center_lat ?? item.CENTER_LAT ?? item.centroid_lat;
    const lng = item.lng ?? item.longitude ?? item.LONGITUDE ?? item.center_lon ?? item.center_lng ?? item.lon ?? item.CENTER_LON ?? item.centroid_lon;
    
    if (lat != null && lng != null) {
      const pLat = parseFloat(lat);
      const pLng = parseFloat(lng);
      if (!isNaN(pLat) && !isNaN(pLng)) return [pLat, pLng];
    }
    
    // Check nested "center" or "centroid" array/object
    const c = item.center || item.centroid || item.location;
    if (Array.isArray(c) && c.length >= 2) return [parseFloat(c[0]), parseFloat(c[1])];
    if (typeof c === 'object' && c !== null) {
      const clat = c.lat ?? c.latitude ?? c.LATITUDE;
      const clng = c.lng ?? c.longitude ?? c.LONGITUDE ?? c.lon;
      if (clat != null && clng != null) return [parseFloat(clat), parseFloat(clng)];
    }

    return null;
  };

  // Find overall center
  let firstPos: [number, number] = [22.5726, 88.3639];
  for (const p of periods) {
    const zones = timePeriods[p].zones || [];
    if (zones.length > 0) {
      const ll = getLL(zones[0]);
      if (ll) { firstPos = ll; break; }
    }
  }

  // Generate JavaScript for layers
  let layerJs = '';
  let layerMapEntries = '';

  periods.forEach((period, idx) => {
    const data = timePeriods[period];
    const groupVar = `group_${period.toLowerCase()}_${idx}`;
    const zones = data.zones || [];
    const ambulances = data.selected_ambulances || data.ambulances || data.optimal_locations || [];
    
    layerJs += `var ${groupVar} = L.featureGroup().addTo(map);\n`;
    
    zones.forEach((z: any, zi: number) => {
      const centroid = getLL(z.centroid || z);
      if (!centroid) return;
      
      const r_val = (z.risk_level || '').toString().toLowerCase();
      let color = 'green';
      if (r_val.includes('red') || r_val.includes('high') || r_val.includes('critical')) color = 'red';
      else if (r_val.includes('orange') || r_val.includes('medium') || r_val.includes('moderate')) color = 'orange';

      // Reconstruct polygon from directional points (The Thesis Method)
      // Correct cyclic order for polygon drawing
      const cyclicKeys = ['north', 'north_east', 'east', 'south_east', 'south', 'south_west', 'west', 'north_west'];
      const dirPts = z.directional_points || {};
      
      let polyPoints: [number, number][] = [];
      if (Object.keys(dirPts).length > 0) {
        polyPoints = cyclicKeys
          .map(k => dirPts[k])
          .filter(p => p && p.lat != null && (p.lng != null || p.lon != null))
          .map(p => [parseFloat(p.lat), parseFloat(p.lng || p.lon)]);
      } else if (Array.isArray(z.boundary_points)) {
        polyPoints = z.boundary_points.map((p: any) => [parseFloat(p.lat || p[0]), parseFloat(p.lng || p[1])]);
      }

      const label = z.zone_id || `Zone ${zi + 1}`;
      const polyVar = `poly_${zi}_${idx}`;
      
      if (polyPoints.length > 0) {
        layerJs += `
          var ${polyVar} = L.polygon(${JSON.stringify(polyPoints)}, {
            color: "${color}", 
            fillColor: "${color}", 
            fillOpacity: 0.3, 
            weight: 2,
            lineJoin: 'round'
          }).addTo(${groupVar});
          
          ${polyVar}.bindTooltip("${label}", { permanent: true, direction: 'center', className: 'zone-label', opacity: 0.8 });

          // Boundary vertex markers (dots at each octagon corner)
          ${JSON.stringify(polyPoints)}.forEach(function(p){
            L.circleMarker(p, { radius: 5, color: "${color}", weight: 2, fillOpacity: 0.9, fillColor: "${color}" }).addTo(${groupVar});
          });
        `;
      } else {
        // Fallback for missing geometry
        const radius = z.radius || 350;
        layerJs += `
          var fallbackPoly_${zi} = L.polygon(getHexagonPoints(${centroid[0]}, ${centroid[1]}, ${radius/111320}), {
            color: "${color}", weight: 2, fillOpacity: 0.3, fillColor: "${color}"
          }).addTo(${groupVar});
          fallbackPoly_${zi}.bindTooltip("${label}", { permanent: true, direction: 'center', className: 'zone-label', opacity: 0.8 });
        `;
      }

      // Exact Centroid Marker with Warning Icon
      layerJs += `
        L.marker([${centroid[0]}, ${centroid[1]}], { 
          icon: L.AwesomeMarkers.icon({ markerColor: "${color}", iconColor: "white", icon: "warning-sign", prefix: "glyphicon" }),
          zOffset: ${color === 'red' ? 1000 : color === 'orange' ? 500 : 0}
        }).bindPopup("<b>${label}</b>").addTo(${groupVar});
      `;
    });

    ambulances.forEach((a: any, ai: number) => {
      const pos = getLL(a);
      if (!pos) return;
      const id = a.ambulance_id || a.id || a.unit_id || ai + 1;
      layerJs += `
        L.marker([${pos[0]}, ${pos[1]}], {
          icon: L.AwesomeMarkers.icon({ markerColor: "blue", iconColor: "white", icon: "plus-sign", prefix: "glyphicon" }),
          zOffset: 2000
        }).bindTooltip("🚑 #${id}").bindPopup("<b>Ambulance #${id}</b>").addTo(${groupVar});
        
        // Coverage Circle (5360m / 5.36km as per Thesis config)
        L.circle([${pos[0]}, ${pos[1]}], { 
          radius: 5360, 
          color: "blue", 
          fill: false, 
          opacity: 0.25, 
          weight: 3 
        }).addTo(${groupVar});
      `;
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
    html,body,#map{width:100%;height:100%;margin:0;padding:0;}
    .leaflet-container{background:#111;}
    .leaflet-control-layers{background:rgba(255,255,255,0.9);border-radius:8px;padding:8px;font-family:inherit;}
    .zone-label{background:transparent !important;border:none !important;box-shadow:none !important;color:#333;font-weight:900;font-size:11px;text-shadow:1px 1px 0 #fff,-1px -1px 0 #fff;}
  </style>
</head><body>
  <div id="map"></div>
  <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.3/dist/leaflet.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js"></script>
  <script>
    var map = L.map('map').setView([${firstPos[0]}, ${firstPos[1]}], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    function getHexagonPoints(lat, lng, r) {
      var pts = [];
      for(var i=0; i<8; i++) {
        var a = Math.PI/4 * i;
        pts.push([lat + r*Math.cos(a), lng + r*Math.sin(a)/Math.cos(lat*Math.PI/180)]);
      }
      return pts;
    }

    ${layerJs}

    var overlayLayers = {
      ${layerMapEntries}
    };

    L.control.layers(null, overlayLayers, { collapsed: false, position: 'topright' }).addTo(map);

    // Add a Legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'rgba(0,0,0,0.7)';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.style.color = 'white';
        div.style.fontSize = '12px';
        div.style.lineHeight = '1.5';
        div.innerHTML = '<b style="color:#FF9933">Risk Zones</b><br>' +
            '<i style="background:red;width:12px;height:12px;display:inline-block;margin-right:5px;opacity:0.6"></i> High Risk<br>' +
            '<i style="background:orange;width:12px;height:12px;display:inline-block;margin-right:5px;opacity:0.6"></i> Med Risk<br>' +
            '<i style="background:green;width:12px;height:12px;display:inline-block;margin-right:5px;opacity:0.6"></i> Low Risk<br>' +
            '<hr style="margin:5px 0;opacity:0.2">' +
            '<b style="color:#138808">Assets</b><br>' +
            '<i style="background:blue;width:12px;height:12px;display:inline-block;margin-right:5px;opacity:0.6"></i> Ambulance';
        return div;
    };
    legend.addTo(map);

    // Only show the first layer by default if none are already checked
    var firstLayerName = Object.keys(overlayLayers)[0];
    if (firstLayerName) {
      // Already added to map in layerJs via .addTo(map), but we might want clear them all and show one
      Object.values(overlayLayers).forEach(function(l){ map.removeLayer(l); });
      map.addLayer(overlayLayers[firstLayerName]);
    }
  </script>
</body></html>`;
}
