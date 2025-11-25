// /components/drivers/mapa/components/MarkerConductor.jsx
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const iconoConductor = L.divIcon({
  className: "driver-div-icon",
  html: `<div style="
    width:36px;height:36px;border-radius:50%;background:#007bff;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:16px;color:white;box-shadow:0 2px 6px rgba(0,0,0,0.35);
  ">🚚</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

export const MarkerConductor = ({ lat, lng, nombre }) => {
  if (lat == null || lng == null) return null;
  const latN = Number(lat);
  const lngN = Number(lng);
  if (Number.isNaN(latN) || Number.isNaN(lngN)) return null;

  return (
    <Marker position={[latN, lngN]} icon={iconoConductor}>
      <Popup>
        <b>Conductor:</b> {nombre || "Desconocido"}<br />
        <b>Lat:</b> {latN.toFixed(5)}<br />
        <b>Lng:</b> {lngN.toFixed(5)}
      </Popup>
    </Marker>
  );
};
