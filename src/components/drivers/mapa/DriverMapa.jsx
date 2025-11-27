import "leaflet/dist/leaflet.css";
import "../../../leaflet-fix";

import { useEffect, useState, useRef } from "react";
import { useRutaActivaPolling } from "./hooks/useRutaActivaPolling";
import { useSimulacionRuta } from "./simulacion/useSimulacionRuta";
import { cerrarRutaService } from "../../../global/api/drivers/cerrarRuta";
import { getConductorByUserId } from "../../../global/api/drivers/rutaActual";

import { Modal } from "../../ui/modal/Modal";
import FormularioEntrega from "./FormularioEntrega";
import Loading from "../../common/Loading";
import { CustomZoomControl } from "./components/CustomZoomControl";

let MapContainer, TileLayer, Polyline, Marker, Popup;
let MarcadoresPaquetes, MarkerConductor;


const POSICION_SENA = [4.6390764, -74.0660737];// Cl. 52 #13-65, Bogotá




export const DriverMapa = ({ driverId }) => {


  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paqueteEnProceso, setPaqueteEnProceso] = useState(null);
  const [modalFinalizacionAbierto, setModalFinalizacionAbierto] = useState(false);
  const [cerrandoRuta, setCerrandoRuta] = useState(false);

  // NUEVO: Estado para datos del conductor (independiente de la ruta)
  const [conductorData, setConductorData] = useState(null);
  const [loadingConductor, setLoadingConductor] = useState(true);

  // Polylines separadas
  const [polylineCompleta, setPolylineCompleta] = useState([]);
  const [polylineRecorrida, setPolylineRecorrida] = useState([]);

  const mapRef = useRef(null);

  const ruta = useRutaActivaPolling(driverId);

  // NUEVO: Obtener datos del conductor independientemente de si tiene ruta
  useEffect(() => {
    const obtenerConductor = async () => {
      try {
        setLoadingConductor(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.id_usuario) {
          const conductor = await getConductorByUserId(user.id_usuario);
          setConductorData(conductor);
        }
      } catch (error) {
        console.error("Error obteniendo conductor:", error);
      } finally {
        setLoadingConductor(false);
      }
    };

    obtenerConductor();
  }, []);

  // GEOMETRY → Polyline completa
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
    polylineCompleta,
    { interval: 300, toleranceKm: 0.15 }
  );

  // Actualizar polyline recorrida siguiendo la ruta real
  useEffect(() => {
    if (!posicionActual || !polylineCompleta.length) return;

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

    const nuevaRecorrida = polylineCompleta.slice(0, indiceMasCercano + 10);
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

  // Carga dinámica de Leaflet
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const leaflet = await import("react-leaflet");
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

  // Determinar nombre y foto del conductor (priorizar datos frescos)
  const nombreConductor =
    ruta?.conductor_detalle?.conductor_detalle?.nombre ||
    ruta?.conductor_nombre ||
    conductorData?.conductor_detalle?.nombre ||
    "Conductor";

  const fotoConductor =
    ruta?.conductor_detalle?.conductor_detalle?.foto_perfil ||
    conductorData?.conductor_detalle?.foto_perfil ||
    null;

  // Determinar posición del conductor
  const obtenerPosicionConductor = () => {
    // Prioridad 1: Posición actual de la simulación
    if (posicionActual?.lat && posicionActual?.lng) {
      return { lat: posicionActual.lat, lng: posicionActual.lng };
    }

    // Prioridad 2: Primer punto de la ruta calculada
    if (polylineCompleta.length > 0) {
      return { lat: polylineCompleta[0][0], lng: polylineCompleta[0][1] };
    }

    // Prioridad 3: Ubicación guardada en el conductor (si es válida)
    if (ruta?.conductor_detalle?.ubicacion_actual_lat &&
      ruta?.conductor_detalle?.ubicacion_actual_lng) {
      const lat = parseFloat(ruta.conductor_detalle.ubicacion_actual_lat);
      const lng = parseFloat(ruta.conductor_detalle.ubicacion_actual_lng);
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        return { lat, lng };
      }
    }

    // Prioridad 4: Posición por defecto (SENA)
    return { lat: POSICION_SENA[0], lng: POSICION_SENA[1] };
  };

  // Sin ruta asignada
  if (!ruta) {
    return (
      <div className="h-screen relative">
        <MapContainer center={POSICION_SENA} zoom={12} zoomControl={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <CustomZoomControl />

          {/* Conductor en posición SENA cuando no hay ruta */}
          {!loadingConductor && (
            <MarkerConductor
              lat={POSICION_SENA[0]}
              lng={POSICION_SENA[1]}
              nombre={nombreConductor}
              fotoUrl={fotoConductor}
            />
          )}
        </MapContainer>
        {/* Z-INDEX CORREGIDO */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9999] animate-slideDown">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sin ruta asignada
            </p>
          </div>
        </div>
      </div>
    );
  }

  const center = polylineCompleta.length > 0 ? polylineCompleta[0] : POSICION_SENA;
  const posicionConductor = obtenerPosicionConductor();

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

        {/* Ruta planificada (gris con línea punteada) */}
        {polylineCompleta.length > 0 && (
          <Polyline
            positions={polylineCompleta}
            pathOptions={{
              color: "#a3b1c2ff",
              weight: 6,
              opacity: 0.7,
              dashArray: "10, 8",
              lineCap: "round"
            }}
          />
        )}

        {/* Ruta recorrida (azul vibrante con sombra) */}
        {polylineRecorrida.length > 1 && (
          <>
            {/* Sombra de la ruta */}
            <Polyline
              positions={polylineRecorrida}
              pathOptions={{
                color: "#1e3a8a",
                weight: 9,
                opacity: 0.3,
                lineCap: "round",
                lineJoin: "round"
              }}
            />
            {/* Ruta principal */}
            <Polyline
              positions={polylineRecorrida}
              pathOptions={{
                color: "#3b82f6",
                weight: 6,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round"
              }}
            />
          </>
        )}

        {/* Paquetes */}
        {ruta.paquetes_asignados?.length > 0 && (
          <MarcadoresPaquetes paquetes={ruta.paquetes_asignados} />
        )}

        {/* Conductor - SIEMPRE VISIBLE con posición por defecto */}
        <MarkerConductor
          lat={posicionConductor.lat}
          lng={posicionConductor.lng}
          nombre={nombreConductor}
          fotoUrl={fotoConductor}
        />
      </MapContainer>

      {/* Modal de entrega */}
      <Modal isOpen={modalAbierto} onClose={() => { }} showCloseButton={false}>
        {paqueteEnProceso && (
          <FormularioEntrega
            paquete={paqueteEnProceso}
            onSubmit={handleCompletarEntrega}
            onClose={() => { }}
          />
        )}
      </Modal>

      {/* Modal de finalización */}
      <Modal isOpen={modalFinalizacionAbierto} onClose={() => { }} showCloseButton={false} size="sm">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4">¡Fin del dia!</h2>
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