import "leaflet/dist/leaflet.css";
import "../../../leaflet-fix"; // asegúrate de ajustar la ruta


import { useEffect, useState, useRef } from "react";

import { useRutaActivaPolling } from "./hooks/useRutaActivaPolling";
import { useSimulacionRuta } from "./simulacion/useSimulacionRuta";
import { SimulacionPanel } from "./simulacion/SimulacionPanel";

let MapContainer, TileLayer;
let PolylineRuta;
let MarcadoresPaquetes;
let MarkerConductor;

export const DriverMapa = ({ driverId }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  const ruta = useRutaActivaPolling(driverId);

  const geometry = (() => {
    if (!ruta?.ruta_optimizada?.geometry) return [];
    const geom = ruta.ruta_optimizada.geometry;
    if (geom.coordinates && Array.isArray(geom.coordinates)) {
      return geom.coordinates.map(([lng, lat]) => [lat, lng]);
    }
    if (Array.isArray(geom)) return geom.map(([lng, lat]) => [lat, lng]);
    return [];
  })();

  const paquetes = ruta?.paquetes_asignados || [];
  const conductorUbic = ruta?.conductor_ubicacion || null;

  // Integramos simulación: recibe ruta y geometry (polyline)
  const { estado, paqueteActual, posicionActual, completarEntrega } = useSimulacionRuta(
    ruta,
    geometry,
    { interval: 900, toleranceKm: 0.005 } // ajustar si quieres más/menos sensibilidad
  );

  // Carga dinámica de componentes (solo 1 vez)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const leaflet = await import("react-leaflet");
        const poly = await import("./components/PolylineRuta");
        const paquetesMod = await import("./components/MarcadoresPaquetes");
        const conductorMod = await import("./components/MarkerConductor");

        if (!mounted) return;
        MapContainer = leaflet.MapContainer;
        TileLayer = leaflet.TileLayer;
        PolylineRuta = poly.PolylineRuta;
        MarcadoresPaquetes = paquetesMod.MarcadoresPaquetes;
        MarkerConductor = conductorMod.MarkerConductor;

        setMapLoaded(true);
      } catch (error) {
        console.error("Error cargando componentes del mapa:", error);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!mapLoaded) return <p>Cargando mapa...</p>;

  if (!ruta) {
    const center = [4.65, -74.1];
    return (
      <div style={{ height: "100vh", width: "100%" }}>
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "12px 16px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            fontWeight: "bold",
          }}
        >
          Sin ruta asignada
        </div>
      </div>
    );
  }

  const mapCenter = geometry?.length > 0 ? geometry[0] : [4.65, -74.1];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }} whenCreated={(m) => (mapRef.current = m)}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {geometry.length > 0 && <PolylineRuta geometry={geometry} />}

        {paquetes.length > 0 && <MarcadoresPaquetes paquetes={paquetes} />}

        {/* Prioridad: mostrar posicionActual (simulación) si existe, sino usar conductorUbic (backend) */}
        {(posicionActual || conductorUbic) && (
          <MarkerConductor
            lat={posicionActual ? posicionActual.lat : Number(conductorUbic.lat)}
            lng={posicionActual ? posicionActual.lng : Number(conductorUbic.lng)}
            nombre={ruta.conductor_nombre || ruta.conductor_detalle?.conductor_detalle?.nombre}
          />
        )}
      </MapContainer>

      {/* Panel de entrega (aparece cuando el hook marca paqueteActual) */}
      {paqueteActual && <SimulacionPanel paquete={paqueteActual} onSubmit={completarEntrega} />}
    </div>
  );
};
