// /components/drivers/mapa/components/MarcadoresPaquetes.jsx
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const getIcon = (orden, estado) => {
  const colorMap = { Pendiente: "orange", Asignado: "blue", "En ruta":"cyan", Entregado:"green", Fallido:"red" };
  const color = colorMap[estado] || "blue";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;">${orden ?? "?"}</div>`,
    iconSize: [28,28],
    iconAnchor: [14,14]
  });
};

export const MarcadoresPaquetes = ({ paquetes }) => {
  if (!paquetes || paquetes.length === 0) return null;
  return (
    <>
      {paquetes.map(p => {
        const latRaw = p.lat ?? p.latitud ?? p.latitude;
        const lngRaw = p.lng ?? p.long ?? p.longitude;
        const lat = latRaw === "" || latRaw == null ? null : Number(latRaw);
        const lng = lngRaw === "" || lngRaw == null ? null : Number(lngRaw);
        if (lat == null || lng == null) return null;

        const clienteNombre = p.cliente?.nombre || p.cliente_detalle?.nombre || p.cliente_nombre || "N/A";
        const direccion = p.direccion_entrega || p.direccion || p.address || "Sin dirección";

        return (
          <Marker key={p.id_paquete} position={[lat, lng]} icon={getIcon(p.orden_entrega, p.estado_paquete)}>
            <Popup>
              <strong>Paquete #{p.id_paquete}</strong><br/>
              <strong>Cliente:</strong> {clienteNombre}<br/>
              <strong>Dirección:</strong> {direccion}<br/>
              <strong>Estado:</strong> {p.estado_paquete}<br/>
              <strong>Orden:</strong> {p.orden_entrega}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
