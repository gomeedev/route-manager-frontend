import { useEffect, useState } from "react";
import { useRutaActiva } from "./hooks/useRutaActiva";
import "leaflet/dist/leaflet.css";

// Componentes dinámicos
let MapContainer, TileLayer;
let PolylineRuta;
let MarcadoresPaquetes;

export const DriverMapa = ({ driverId }) => {
    const [mapLoaded, setMapLoaded] = useState(false);

    const {
        ruta,
        geometry,
        paquetes,
        conductor,
        loading,
        error,
    } = useRutaActiva(driverId);

    // 1. Cargamos react-leaflet y nuestros componentes solo UNA VEZ
    useEffect(() => {
        const load = async () => {
            try {
                const leaflet = await import("react-leaflet");
                const poly = await import("./components/PolylineRuta");
                const paquetesMod = await import("./components/MarcadoresPaquetes");

                MapContainer = leaflet.MapContainer;
                TileLayer = leaflet.TileLayer;
                PolylineRuta = poly.PolylineRuta;
                MarcadoresPaquetes = paquetesMod.MarcadoresPaquetes;

                setMapLoaded(true);
            } catch (error) {
                console.error("Error cargando componentes del mapa:", error);
            }
        };

        load();
    }, []);

    if (!mapLoaded) return <p>Cargando mapa...</p>;
    if (loading) return <p>Cargando ruta...</p>;
    if (error) return <p>Error cargando ruta</p>;

    // Centro inicial: si hay geometry lo centramos ahí, si no Bogotá
    const mapCenter = geometry?.length > 0 ? geometry[0] : [4.65, -74.1];

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                {paquetes?.length > 0 && <MarcadoresPaquetes paquetes={paquetes} />}

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* ⬇️ Si la ruta está asignada o en ruta, mostramos polyline */}
                {geometry?.length > 0 && <PolylineRuta geometry={geometry} />}

                {/* Aquí agregaremos más componentes luego:
                    - MarcadoresPaquetes
                    - MarcadorConductor
                    - useSimulacion (si ruta.estado === "En ruta")
                */}
            </MapContainer>
        </div>
    );
};
