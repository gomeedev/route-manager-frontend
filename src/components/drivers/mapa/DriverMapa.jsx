import "leaflet/dist/leaflet.css";
import "../../../leaflet-fix";

import { useEffect, useState, useRef } from "react";
import { useRutaActivaPolling } from "./hooks/useRutaActivaPolling";
import { useSimulacionRuta } from "./simulacion/useSimulacionRuta";
import { cerrarRutaService } from "../../../global/api/drivers/cerrarRuta";

import { Modal } from "../../ui/modal/Modal";
import FormularioEntrega from "./FormularioEntrega";
import Loading from "../../common/Loading";
import { CustomZoomControl } from "./components/CustomZoomControl";

let MapContainer, TileLayer, Polyline, Marker, Popup;
let MarcadoresPaquetes, MarkerConductor;

export const DriverMapa = ({ driverId }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paqueteEnProceso, setPaqueteEnProceso] = useState(null);
  const [modalFinalizacionAbierto, setModalFinalizacionAbierto] = useState(false);
  const [cerrandoRuta, setCerrandoRuta] = useState(false);

  // NUEVO: Polylines separadas
  const [polylineCompleta, setPolylineCompleta] = useState([]);     // Gris (planificada)
  const [polylineRecorrida, setPolylineRecorrida] = useState([]);   // Azul fuerte (real)

  const mapRef = useRef(null);

  const ruta = useRutaActivaPolling(driverId);

  // GEOMETRY → Polyline completa (gris)
  useEffect(() => {
    if (!ruta?.ruta_optimizada?.geometry) {
      setPolylineCompleta([]);
      setPolylineRecorrida([]);
      return;
    }

    const geom = ruta.ruta_optimizada.geometry;
    const coords = Array.isArray(geom)
      ? geom.map(([lng, lat]) => [lat, lng])
      : geom.coordinates?.map(([lng, lat]) => [lat, lng]) || [];

    setPolylineCompleta(coords);

    // Si hay al menos un punto → iniciar polyline recorrida desde ahí
    if (coords.length > 0) {
      setPolylineRecorrida([coords[0]]);
    }
  }, [ruta]);

  // SIMULACIÓN
  const {
    estado,
    paqueteActual,
    posicionActual,
    completarEntrega,
  } = useSimulacionRuta(
    ruta,
    polylineCompleta, // ← le pasamos la completa para que recorra todo
    { interval: 300, toleranceKm: 0.15 }
  );

  // Actualizar polyline recorrida en cada movimiento
  // Actualizar polyline recorrida SIGUIENDO LA RUTA REAL (no puntos crudos)
  useEffect(() => {
    if (!posicionActual || !polylineCompleta.length) return;

    // Encontrar el índice más cercano al punto actual en la polyline completa
    const puntoActual = [posicionActual.lat, posicionActual.lng];
    let indiceMasCercano = 0;
    let distanciaMin = Infinity;

    polylineCompleta.forEach((punto, i) => {
      const dist = Math.hypot(punto[0] - puntoActual[0], punto[1] - puntoActual[1]);
      if (dist < distanciaMin) {
        distanciaMin = dist;
        indiceMasCercano = i;
      }
    });

    // Tomar todos los puntos desde inicio hasta el más cercano
    const nuevaRecorrida = polylineCompleta.slice(0, indiceMasCercano + 10); // +10 para suavizar

    setPolylineRecorrida(nuevaRecorrida);
  }, [posicionActual, polylineCompleta]);

  // Abrir modal cuando detecta paquete
  useEffect(() => {
    if (paqueteActual && !modalAbierto) {
      setPaqueteEnProceso(paqueteActual);
      setModalAbierto(true);
    }
  }, [paqueteActual]);

  // Finalización automática
  useEffect(() => {
    if (estado === "finished") {
      setModalFinalizacionAbierto(true);
    }
  }, [estado]);

  const handleCompletarEntrega = async (estadoEntrega, archivo, observacion) => {
    if (!paqueteEnProceso) return;

    try {
      await completarEntrega(
        paqueteEnProceso.id_paquete,
        estadoEntrega,
        archivo,
        observacion
      );
      setModalAbierto(false);
      setPaqueteEnProceso(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalizarRuta = async () => {
    setCerrandoRuta(true);
    try {
      await cerrarRutaService(ruta.id_ruta);
      window.location.reload();
    } catch (error) {
      alert("Error al finalizar ruta");
    } finally {
      setCerrandoRuta(false);
    }
  };

  // Carga dinámica de Leaflet — VERSIÓN 100% FUNCIONAL
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const leaflet = await import("react-leaflet");

      // ← ESTO FALTABA (causa del crash)
      const paquetesModule = await import("./components/MarcadoresPaquetes");
      const conductorModule = await import("./components/MarkerConductor");

      if (!mounted) return;

      MapContainer = leaflet.MapContainer;
      TileLayer = leaflet.TileLayer;
      Polyline = leaflet.Polyline;
      Marker = leaflet.Marker;
      Popup = leaflet.Popup;

      MarcadoresPaquetes = paquetesModule.MarcadoresPaquetes;
      MarkerConductor = conductorModule.MarkerConductor;

      setMapLoaded(true);
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (!mapLoaded) return <div className="w-full flex justify-center py-10"><Loading /></div>;

  if (!ruta) {
    const center = [4.65, -74.1];
    return (
      <div className="h-screen relative">
        <MapContainer center={center} zoom={12} zoomControl={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <CustomZoomControl />
        </MapContainer>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-lg shadow-lg font-bold">
          Sin ruta asignada
        </div>
      </div>
    );
  }

  const center = polylineCompleta.length > 0 ? polylineCompleta[0] : [4.65, -74.1];

  return (
    <div className="h-screen relative overflow-hidden rounded-xl">
      <MapContainer
        center={center}
        zoom={14}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(m) => (mapRef.current = m)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CustomZoomControl />

        {/* 1. Ruta planificada (gris más intenso) */}
        {polylineCompleta.length > 0 && (
          <Polyline
            positions={polylineCompleta}
            pathOptions={{ color: "#64748b", weight: 8, opacity: 0.6 }}
          />
        )}

        {/* 2. Ruta recorrida (azul fuerte, encima) */}
        {polylineRecorrida.length > 1 && (
          <Polyline
            positions={polylineRecorrida}
            pathOptions={{ color: "#2563eb", weight: 9, opacity: 1 }}
          />
        )}

        {/* Paquetes */}
        {ruta.paquetes_asignados?.length > 0 && (
          <MarcadoresPaquetes paquetes={ruta.paquetes_asignados} />
        )}

        {/* Conductor */}
        {posicionActual && (
          <MarkerConductor
            lat={posicionActual.lat}
            lng={posicionActual.lng}
            nombre={ruta.conductor_detalle?.conductor_detalle?.nombre}
            fotoUrl={ruta.conductor_detalle?.conductor_detalle?.foto_perfil}
          />
        )}
      </MapContainer>

      {/* Modal entrega */}
      <Modal isOpen={modalAbierto} onClose={() => { }} showCloseButton={false}>
        {paqueteEnProceso && (
          <FormularioEntrega
            paquete={paqueteEnProceso}
            onSubmit={handleCompletarEntrega}
            onClose={() => { }}
          />
        )}
      </Modal>

      {/* Modal finalización */}
      <Modal isOpen={modalFinalizacionAbierto} onClose={() => { }} showCloseButton={false} size="sm">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4">¡Ruta completada!</h2>
          <p className="text-lg mb-6">
            {ruta.paquetes_entregados} entregados · {ruta.paquetes_fallidos} fallidos
          </p>
          <button
            onClick={handleFinalizarRuta}
            disabled={cerrandoRuta}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {cerrandoRuta ? "Finalizando..." : "Finalizar ruta"}
          </button>
        </div>
      </Modal>
    </div>
  );
};