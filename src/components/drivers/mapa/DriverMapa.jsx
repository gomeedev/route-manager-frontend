import "leaflet/dist/leaflet.css";
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

    // 🔥 1. Polling de la ruta activa
    const ruta = useRutaActivaPolling(driverId);

    // 🔥 2. Extraer geometry con formato [lat,lng]
    const geometry = (() => {
        if (!ruta?.ruta_optimizada?.geometry) return [];

        const geom = ruta.ruta_optimizada.geometry;

        // Si es GeoJSON con .coordinates
        if (geom.coordinates && Array.isArray(geom.coordinates)) {
            return geom.coordinates.map(([lng, lat]) => [lat, lng]);
        }

        // Si es array plano directamente
        if (Array.isArray(geom)) {
            return geom.map(([lng, lat]) => [lat, lng]);
        }

        return [];
    })();

    console.log("ruta_optimizada RAW:", ruta?.ruta_optimizada);


    // 🔥 3. Paquetes
    const paquetes = ruta?.paquetes_asignados || [];

    // 🔥 4. Conductor ubicación
    const conductorUbic = ruta?.conductor_ubicacion || null;

    // 🔥 5. SIMULACIÓN
    const {
        estado,
        paqueteActual,
        posicionActual,
        completarEntrega
    } = useSimulacionRuta(ruta, geometry);

    console.log("RUTA COMPLETA:", JSON.stringify(ruta, null, 2));
    console.log("GEOMETRY PROCESADO:", geometry);
    console.log("CONDUCTOR UBICACION:", conductorUbic);


    // 🔥 6. Carga de componentes dinámicos SOLO UNA VEZ
    useEffect(() => {
        const load = async () => {
            try {
                const leaflet = await import("react-leaflet");
                const poly = await import("./components/PolylineRuta");
                const paquetesMod = await import("./components/MarcadoresPaquetes");
                const conductorMod = await import("./components/MarkerConductor");

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
    }, []);

    if (!mapLoaded) return <p>Cargando mapa...</p>;

    // 🔥 7. SI NO HAY RUTA
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

    // 🔥 8. SI HAY RUTA
    const mapCenter = geometry?.length > 0 ? geometry[0] : [4.65, -74.1];

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                whenCreated={map => (mapRef.current = map)}
            >

                {/* CAPA BASE */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* 🔵 Polyline */}
                {geometry.length > 0 && <PolylineRuta geometry={geometry} />}

                {/* 📦 Paquetes */}
                {paquetes.length > 0 && <MarcadoresPaquetes paquetes={paquetes} />}

                {/* 🚚 Conductor */}
                {/* 🚚 Conductor - usar posición de simulación si existe */}
                {(posicionActual || conductorUbic) && (
                    <MarkerConductor
                        lat={posicionActual ? posicionActual.lat : Number(conductorUbic.lat)}
                        lng={posicionActual ? posicionActual.lng : Number(conductorUbic.lng)}
                        nombre={ruta.conductor_nombre || ruta.conductor_detalle?.conductor_detalle?.nombre}
                    />
                )}
            </MapContainer>

            {/* PANEL DE ENTREGA */}
            {paqueteActual && (
                <SimulacionPanel
                    paquete={paqueteActual}
                    onSubmit={completarEntrega}
                />
            )}
        </div>
    );
};
