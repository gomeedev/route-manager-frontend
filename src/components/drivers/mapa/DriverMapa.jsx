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
import { toast } from "sonner";

let MapContainer, TileLayer, Polyline, Marker, Popup;
let MarcadoresPaquetes, MarkerConductor;

export const DriverMapa = ({ driverId }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paqueteEnProceso, setPaqueteEnProceso] = useState(null);
  const [modalFinalizacionAbierto, setModalFinalizacionAbierto] = useState(false);
  const [cerrandoRuta, setCerrandoRuta] = useState(false);


  const [progresoActual, setProgresoActual] = useState({
    entregados: 0,
    fallidos: 0,
    total: 0
  });


  // Agrega este estado para forzar reinicio de simulación
  const [rutaKey, setRutaKey] = useState(0);

  // Estado para datos del conductor
  const [conductorData, setConductorData] = useState(null);
  const [loadingConductor, setLoadingConductor] = useState(true);

  // Polylines separadas
  const [polylineCompleta, setPolylineCompleta] = useState([]);
  const [polylineRecorrida, setPolylineRecorrida] = useState([]);

  const mapRef = useRef(null);
  const { ruta, detenerPolling, refrescarRuta } = useRutaActivaPolling(driverId);

  // FUNCIÓN: Obtener posición base del conductor (REAL)
  const obtenerPosicionBase = () => {
    // Prioridad 1: Conductor ya cargado independientemente
    if (conductorData?.base_lat && conductorData?.base_lng) {
      const lat = parseFloat(conductorData.base_lat);
      const lng = parseFloat(conductorData.base_lng);
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        console.log("Usando posición base de conductorData:", { lat, lng });
        return [lat, lng];
      }
    }

    // Prioridad 2: Conductor en la ruta actual
    if (ruta?.conductor_detalle?.base_lat && ruta?.conductor_detalle?.base_lng) {
      const lat = parseFloat(ruta.conductor_detalle.base_lat);
      const lng = parseFloat(ruta.conductor_detalle.base_lng);
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        console.log("Usando posición base de ruta.conductor_detalle:", { lat, lng });
        return [lat, lng];
      }
    }

    // Prioridad 3: Ubicación actual del conductor
    if (conductorData?.ubicacion_actual_lat && conductorData?.ubicacion_actual_lng) {
      const lat = parseFloat(conductorData.ubicacion_actual_lat);
      const lng = parseFloat(conductorData.ubicacion_actual_lng);
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        console.log("Usando ubicación actual de conductorData:", { lat, lng });
        return [lat, lng];
      }
    }

    // Fallback: Posición del SENA (solo si TODO falla)
    console.warn("Usando posición fallback SENA");
    return [4.6390764, -74.0660737];
  };

  // Obtener datos del conductor
  useEffect(() => {
    const obtenerConductor = async () => {
      try {
        setLoadingConductor(true);
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.id_usuario) {
          const conductor = await getConductorByUserId(user.id_usuario);
          console.log("Datos del conductor obtenidos:", {
            nombre: conductor?.conductor_detalle?.nombre,
            base_lat: conductor?.base_lat,
            base_lng: conductor?.base_lng,
            direccion_base: conductor?.direccion_base
          });
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

  // Efecto para detectar cuando la ruta cambia a "En ruta"
  useEffect(() => {
    if (!ruta) return;

    if (ruta.estado === "En ruta") {
      console.log("Ruta en estado 'En ruta', forzando actualización");

      // Forzar un refresh del polling
      if (refrescarRuta) {
        refrescarRuta();
      }

      // Incrementar la key para forzar remontaje del hook de simulación
      setRutaKey(prev => prev + 1);
    }
  }, [ruta?.estado, refrescarRuta]);

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
    { interval: 300, toleranceKm: 0.25 },
    rutaKey // Pasa la key como parámetro extra
  );

  // Actualizar polyline recorrida
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
  }, [posicionActual, polylineCompleta, rutaKey]); // Agrega rutaKey aquí

  // Abrir modal cuando detecta paquete
  useEffect(() => {
    if (paqueteActual) {
      console.log("PAQUETE DETECTADO: Abriendo modal");
      setPaqueteEnProceso(paqueteActual);
      setModalAbierto(true);
    } else if (!paqueteActual && modalAbierto) {
      // Cerrar modal cuando paqueteActual se limpia
      setModalAbierto(false);
      setPaqueteEnProceso(null);
    }
  }, [paqueteActual]);

  // Finalización automática
  useEffect(() => {
    if (estado === "finished") {
      console.log("Simulación terminada");

      // Esperar 1 segundo para que el backend procese la última entrega
      setTimeout(async () => {
        // Refrescar datos una última vez
        if (refrescarRuta) {
          await refrescarRuta();
        }

        console.log("Deteniendo polling");
        detenerPolling();

        console.log("Estado final:", {
          entregados: ruta?.paquetes_entregados,
          fallidos: ruta?.paquetes_fallidos,
          total: ruta?.total_paquetes
        });

        setModalFinalizacionAbierto(true);
      }, 1000);
    }
  }, [estado, detenerPolling, refrescarRuta]);


  useEffect(() => {
    if (ruta) {
      setProgresoActual({
        entregados: ruta.paquetes_entregados || 0,
        fallidos: ruta.paquetes_fallidos || 0,
        total: ruta.total_paquetes || 0
      });
    }
  }, [ruta]);


  const handleCompletarEntrega = async (estadoEntrega, archivo, observacion) => {
    if (!paqueteEnProceso) return;

    console.log("Procesando entrega...");

    try {
      await completarEntrega(
        paqueteEnProceso.id_paquete,
        estadoEntrega,
        archivo,
        observacion
      );

      if (refrescarRuta) {
        setTimeout(() => {
          refrescarRuta();
        }, 500);
      }

      // Cerrar modal después de completar
      setTimeout(() => {
        setModalAbierto(false);
        setPaqueteEnProceso(null);
      }, 100);
    } catch (error) {
      console.error("Error al completar entrega:", error);
    }
  };

  const handleFinalizarRuta = async () => {
    setCerrandoRuta(true);
    try {
      await cerrarRutaService(ruta.id_ruta);
      setTimeout(() => {
        window.location.href = "/driver";
      }, 1500);
    } catch (error) {
      if (error.response?.status === 400) {
        // La ruta ya estaba cerrada
        toast.error("¡Ruta ya completada! Redirigiendo...")
        setTimeout(() => {
          window.location.href = "/driver";
        }, 1500);
      } else {
        toast.error("Error al finalizar ruta: " + (error.response?.data?.error || error.message));
        setCerrandoRuta(false);
      }
    }
  };

  // FUNCIÓN: Determinar posición del conductor
  const obtenerPosicionConductor = () => {
    // Prioridad 1: Posición actual de la simulación
    if (posicionActual?.lat && posicionActual?.lng) {
      return { lat: posicionActual.lat, lng: posicionActual.lng };
    }

    // Prioridad 2: Posición base del conductor (REAL)
    const posicionBase = obtenerPosicionBase();
    if (posicionBase[0] && posicionBase[1]) {
      return {
        lat: posicionBase[0],
        lng: posicionBase[1]
      };
    }

    // Prioridad 3: Primer punto de la ruta calculada
    if (polylineCompleta.length > 0) {
      return { lat: polylineCompleta[0][0], lng: polylineCompleta[0][1] };
    }

    // Prioridad 4: Fallback extremo
    return { lat: 4.6390764, lng: -74.0660737 };
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

  // Determinar nombre y foto del conductor
  const nombreConductor =
    ruta?.conductor_detalle?.conductor_detalle?.nombre ||
    ruta?.conductor_nombre ||
    conductorData?.conductor_detalle?.nombre ||
    "Conductor";

  const fotoConductor =
    ruta?.conductor_detalle?.conductor_detalle?.foto_perfil ||
    conductorData?.conductor_detalle?.foto_perfil ||
    null;

  // Obtener posición del conductor
  const posicionConductor = obtenerPosicionConductor();

  // CENTRO DEL MAPA: Usar posición base del conductor
  const obtenerCentroMapa = () => {
    if (polylineCompleta.length > 0) {
      return polylineCompleta[0];
    }
    return obtenerPosicionBase();
  };

  const centroMapa = obtenerCentroMapa();

  // Sin ruta asignada
  if (!ruta) {
    return (
      <div className="h-screen relative">
        <MapContainer
          center={centroMapa}
          zoom={14}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <CustomZoomControl />

          {/* Mostrar posición base del conductor */}
          {!loadingConductor && (
            <MarkerConductor
              lat={posicionConductor.lat}
              lng={posicionConductor.lng}
              nombre={nombreConductor}
              fotoUrl={fotoConductor}
            />
          )}
        </MapContainer>

        {/* Información de ubicación base */}
        <div className="absolute top-4 left-4 z-[9999]">
          <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tu Ubicación
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {conductorData?.direccion_base || "Dirección no configurada"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sin ruta asignada */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[9998]">
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

  return (
    <div className="h-screen relative overflow-hidden rounded-xl">
      <MapContainer
        center={centroMapa}
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
              color: "#7b8188ff",
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
                weight: 2,
                opacity: 0.8,
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

        {/* Conductor */}
        <MarkerConductor
          lat={posicionConductor.lat}
          lng={posicionConductor.lng}
          nombre={nombreConductor}
          fotoUrl={fotoConductor}
        />
      </MapContainer>

      {/* Información de simulación */}
      <div className="absolute top-4 left-4 z-[9999]">
        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
{/*               <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado: <span className="font-bold">{estado === "running" ? "En ruta" : estado}</span>
              </p> */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {ruta.total_paquetes - (ruta.paquetes_entregados + ruta.paquetes_fallidos)} paquetes pendientes
              </p>
            </div>
          </div>

          {/* Mostrar dirección base si existe */}
          {conductorData?.direccion_base && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tu dirección: {conductorData.direccion_base}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de entrega */}
      <Modal isOpen={modalAbierto} onClose={() => {
        setModalAbierto(false);
        setPaqueteEnProceso(null);
      }} showCloseButton={false}>
        {paqueteEnProceso && (
          <FormularioEntrega
            paquete={paqueteEnProceso}
            onSubmit={handleCompletarEntrega}
            onClose={() => { }}
          />
        )}
      </Modal>

      {/* Modal de finalización */}
      <Modal
        isOpen={modalFinalizacionAbierto}
        onClose={() => {
          if (!cerrandoRuta) {
            setModalFinalizacionAbierto(false);
          }
        }}
        showCloseButton={!cerrandoRuta}
        size="sm"
      >
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4">¡Fin del día!</h2>

          {/* Mostrar datos actualizados */}
          <div className="mb-6">
            <p className="text-lg">
              {progresoActual.entregados} entregados · {progresoActual.fallidos} fallidos
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Total de paquetes: {progresoActual.total}
            </p>
            {progresoActual.entregados + progresoActual.fallidos < progresoActual.total && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                Parece que no se registraron todas las entregas
              </p>
            )}
          </div>

          <button
            onClick={handleFinalizarRuta}
            disabled={cerrandoRuta}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 transition-colors"
          >
            {cerrandoRuta ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Finalizando...
              </span>
            ) : (
              "Finalizar ruta"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};