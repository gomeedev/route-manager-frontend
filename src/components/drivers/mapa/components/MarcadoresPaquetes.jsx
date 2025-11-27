import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Badge from "../../../ui/badge/Badge";

const getIcon = (orden, estado) => {
  const estiloMap = {
    Pendiente: { bg: "#f59e0b", border: "#d97706", shadow: "0 4px 8px rgba(245, 158, 11, 0.4)" },
    Asignado: { bg: "#3b82f6", border: "#2563eb", shadow: "0 4px 8px rgba(59, 130, 246, 0.4)" },
    "En ruta": { bg: "#06b6d4", border: "#0891b2", shadow: "0 4px 8px rgba(6, 182, 212, 0.4)" },
    Entregado: { bg: "#10b981", border: "#059669", shadow: "0 4px 8px rgba(16, 185, 129, 0.4)" },
    Fallido: { bg: "#ef4444", border: "#dc2626", shadow: "0 4px 8px rgba(239, 68, 68, 0.4)" }
  };

  const estilo = estiloMap[estado] || estiloMap.Asignado;

  return L.divIcon({
    className: "custom-marker-paquete",
    html: `
      <div style="
        background: ${estilo.bg};
        background: linear-gradient(135deg, ${estilo.bg} 0%, ${estilo.border} 100%);
        color: white;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 15px;
        border: 3px solid white;
        box-shadow: ${estilo.shadow};
        position: relative;
        transition: transform 0.2s ease;
      ">
        ${orden ?? "?"}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
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
        
        if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;

        const clienteNombre = p.cliente?.nombre || p.cliente_detalle?.nombre || p.cliente_nombre || "N/A";
        const direccion = p.direccion_entrega || p.direccion || p.address || "Sin dirección";

        return (
          <Marker 
            key={p.id_paquete} 
            position={[lat, lng]} 
            icon={getIcon(p.orden_entrega, p.estado_paquete)}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <strong style={{ fontSize: "16px", color: "#1e293b" }}>
                  Paquete #{p.id_paquete}
                </strong>
                <br/><br/>
                <strong>Cliente:</strong> {clienteNombre}<br/>
                <strong>Dirección:</strong> {direccion}<br/>
                <strong>Estado:</strong> <span style={{ 
                  padding: "2px 8px", 
                  borderRadius: "4px", 
                  fontSize: "12px",
                  fontWeight: "600"
                }}><Badge>{p.estado_paquete}</Badge></span><br/>
                <strong>Orden de entrega:</strong> #{p.orden_entrega}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};