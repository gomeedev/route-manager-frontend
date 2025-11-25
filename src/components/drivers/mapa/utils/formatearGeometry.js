// /src/components/drivers/utils/formatearGeometry.js
export function formatearGeometry(geometry) {
  // geometry puede ser:
  //  - un objeto GeoJSON { coordinates: [[lng,lat],[lng,lat], ...] }
  //  - o un array plano [[lng,lat],...]
  if (!geometry) return [];

  const coords = geometry.coordinates ? geometry.coordinates : geometry;

  // Invertir a [lat, lng]
  return coords.map(([lng, lat]) => [lat, lng]);
}
