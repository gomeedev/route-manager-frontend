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

let MapContainer, TileLayer;
let PolylineRuta;
let MarcadoresPaquetes;
let MarkerConductor;

export const DriverMapa = ({ driverId }) => {

  const [mapLoaded, setMapLoaded] = useState(false);
  const [cerrandoRuta, setCerrandoRuta] = useState(false);

  // 🔒 Estado local para controlar el modal manualmente
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paqueteEnProceso, setPaqueteEnProceso] = useState(null);

  // 🎉 NUEVO: Estado para controlar el modal de finalización
  const [modalFinalizacionAbierto, setModalFinalizacionAbierto] = useState(false);

  const mapRef = useRef(null);

  const ruta = useRutaActivaPolling(driverId);

  // ░░ GEOMETRY
  const geometry = (() => {
    if (!ruta?.ruta_optimizada?.geometry) return [];

    const geom = ruta.ruta_optimizada.geometry;

    if (geom.coordinates && Array.isArray(geom.coordinates)) {
      return geom.coordinates.map(([lng, lat]) => [lat, lng]);
    }
    if (Array.isArray(geom)) {
      return geom.map(([lng, lat]) => [lat, lng]);
    }
    return [];
  })();

  const paquetes = ruta?.paquetes_asignados || [];
  const conductorUbic = ruta?.conductor_ubicacion || null;

  // ░░ SIMULACIÓN
  const {
    estado,
    paqueteActual,
    posicionActual,
    completarEntrega,
  } = useSimulacionRuta(
    ruta,
    geometry,
    {
      interval: 300,
      toleranceKm: 0.15
    }
  );

  // 🔒 Sincronizar paqueteActual con modal controlado
  useEffect(() => {
    if (paqueteActual && !modalAbierto) {
      console.log("🔓 Abriendo modal para paquete:", paqueteActual.id_paquete);
      setPaqueteEnProceso(paqueteActual);
      setModalAbierto(true);
    }
  }, [paqueteActual]);

  // 🎉 NUEVO: Abrir modal de finalización cuando termine la ruta
  useEffect(() => {
    if (estado === "finished") {
      setModalFinalizacionAbierto(true);
    }
  }, [estado]);

  // 🔒 Handler mejorado de completar entrega
  const handleCompletarEntrega = async (estadoEntrega, archivo, observacion) => {
    if (!paqueteEnProceso) return;

    try {
      await completarEntrega(
        paqueteEnProceso.id_paquete,
        estadoEntrega,
        archivo,
        observacion
      );

      // Cerrar modal MANUALMENTE después de éxito
      setModalAbierto(false);
      setPaqueteEnProceso(null);

    } catch (error) {
      console.error(error);
      // NO cerrar el modal si hay error
    }
  };

  // ░░ CARGA DE LEAFLET
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
        console.error("Error cargando Leaflet:", error);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!mapLoaded) return (
    <div className="w-full flex justify-center py-10">
      <Loading />
    </div>
  )

  // ░░ SIN RUTA
  if (!ruta) {
    const center = [4.65, -74.1];
    return (
      <div style={{
        height: "calc(100vh - 80px)",
        width: "100%",
        overflow: "hidden",
        borderRadius: "12px"
      }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <CustomZoomControl />
        </MapContainer>

        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "0px 16px",
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

  const mapCenter = geometry.length > 0 ? geometry[0] : [4.65, -74.1];

  // Handler para finalizar ruta manualmente
  const handleFinalizarRuta = async () => {
    if (!ruta) return;


    setCerrandoRuta(true);
    try {
      await cerrarRutaService(ruta.id_ruta);
      console.log("Ruta cerrada exitosamente");
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar ruta:", error);
      alert("Error al finalizar la ruta: " + (error.response?.data?.error || error.message));
    } finally {
      setCerrandoRuta(false);
    }
  };

  return (
    <div style={{
      height: "calc(100vh - 80px)",
      width: "100%",
      overflow: "hidden",
      borderRadius: "12px"
    }}>

      {/* ░░ MAPA */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        zoomControl={false}
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
        whenCreated={(m) => (mapRef.current = m)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <CustomZoomControl />

        {geometry.length > 0 && <PolylineRuta geometry={geometry} />}
        {paquetes.length > 0 && <MarcadoresPaquetes paquetes={paquetes} />}

        {(posicionActual || conductorUbic) && (
          <MarkerConductor
            lat={posicionActual ? posicionActual.lat : Number(conductorUbic.lat)}
            lng={posicionActual ? posicionActual.lng : Number(conductorUbic.lng)}
            nombre={ruta.conductor_detalle.conductor_detalle.nombre}
            fotoUrl={ruta.conductor_detalle.conductor_detalle.foto_perfil}
          />
        )}
      </MapContainer>

      {/* 🔍 DEBUG: Indicador visual cuando detecta paquete */}
      {paqueteActual && (
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "#16a34a",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          zIndex: 9998,
          fontWeight: "bold"
        }}>
          🎯 Paquete detectado: #{paqueteActual.id_paquete}
        </div>
      )}

      {/* 🔒 MODAL CONTROLADO MANUALMENTE (ya no depende de paqueteActual) */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          console.log("⚠️ Intento de cerrar modal bloqueado");
          // NO hacer nada - forzar que complete la entrega
        }}
        showCloseButton={false}
      >
        {paqueteEnProceso && (
          <FormularioEntrega
            paquete={paqueteEnProceso}
            onSubmit={handleCompletarEntrega}
            onClose={() => { }}
          />
        )}
      </Modal>

      {/* 🎉 MODAL DE FINALIZACIÓN DE RUTA */}
      <Modal
        isOpen={modalFinalizacionAbierto}
        onClose={() => { }}
        showCloseButton={false}
        size="sm"
      >
        <div style={{ textAlign: "center" }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Fin del día
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-2 text-[15px]">
              {ruta?.paquetes_entregados || 0} entregados · {ruta?.paquetes_fallidos || 0} fallidos
            </p>

            <p className="text-gray-400 dark:text-gray-400 mb-6 text-[13px]">
              Presiona <b className="text-gray-700 dark:text-gray-200">Finalizar ruta</b> para liberar tu estado y el vehículo asignado.
            </p>

            <button
              onClick={handleFinalizarRuta}
              disabled={cerrandoRuta}
              className={`
      w-full px-6 py-3.5 text-white rounded-lg text-base font-semibold
      transition-all shadow-md
      ${cerrandoRuta
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }
    `}
            >
              {cerrandoRuta ? "Finalizando..." : "Finalizar ruta"}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}