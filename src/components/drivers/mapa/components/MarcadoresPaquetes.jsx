import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Función para crear iconos personalizados por estado
const getIcon = (orden, estado) => {
    const colorMap = {
        Pendiente: "orange",
        Asignado: "blue",
        "En ruta": "cyan",
        Entregado: "green",
        Fallido: "red",
    };

    const color = colorMap[estado] || "blue";

    return L.divIcon({
        className: "custom-marker",
        html: `
            <div style="
                background:${color};
                color:white;
                border-radius:50%;
                width:28px;
                height:28px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:14px;
                font-weight:bold;
                box-shadow:0 0 4px rgba(0,0,0,0.5);
            ">
                ${orden}
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

export const MarcadoresPaquetes = ({ paquetes }) => {
    if (!paquetes || paquetes.length === 0) return null;

    return (
        <>
            {paquetes.map((p) => {
                if (!p.lat || !p.lng) return null;

                return (
                    <Marker
                        key={p.id_paquete}
                        position={[parseFloat(p.lat), parseFloat(p.lng)]}
                        icon={getIcon(p.orden_entrega, p.estado_paquete)}
                    >
                        <Popup>
                            <strong>Paquete #{p.id_paquete}</strong> <br />
                            <strong>Cliente:</strong> {p.cliente?.nombre || "N/A"} <br />
                            <strong>Dirección:</strong> {p.direccion_entrega}<br />
                            <strong>Estado:</strong> {p.estado_paquete}<br />
                            <strong>Orden:</strong> {p.orden_entrega}
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};
