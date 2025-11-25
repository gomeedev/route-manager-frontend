import "leaflet/dist/leaflet.css";
import "../../../leaflet-fix";

import { useEffect, useState, useRef } from "react";

import { useRutaActivaPolling } from "./hooks/useRutaActivaPolling";
import { useSimulacionRuta } from "./simulacion/useSimulacionRuta";
import { cerrarRutaService } from "../../../global/api/drivers/cerrarRuta";

import { Modal } from "../../ui/modal/Modal";
import FormularioEntrega from "./FormularioEntrega";

let MapContainer, TileLayer;
let PolylineRuta;
let MarcadoresPaquetes;
let MarkerConductor;

export const DriverMapa = ({ driverId }) => {

  const [mapLoaded, setMapLoaded] = useState(false);
  const [cerrandoRuta, setCerrandoRuta] = useState(false);

  // 🔒 NUEVO: Estado local para controlar el modal manualmente
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paqueteEnProceso, setPaqueteEnProceso] = useState(null);

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

  // 🔒 NUEVO: Sincronizar paqueteActual con modal controlado
  useEffect(() => {
    if (paqueteActual && !modalAbierto) {
      console.log("🔓 Abriendo modal para paquete:", paqueteActual.id_paquete);
      setPaqueteEnProceso(paqueteActual);
      setModalAbierto(true);
    }
  }, [paqueteActual]);

  // 🔒 NUEVO: Handler mejorado de completar entrega
  const handleCompletarEntrega = async (estadoEntrega, archivo, observacion) => {
    if (!paqueteEnProceso) return;

    try {
      await completarEntrega(
        paqueteEnProceso.id_paquete,
        estadoEntrega,
        archivo,
        observacion
      );

      console.log("✅ Entrega completada, cerrando modal manualmente");

      // Cerrar modal MANUALMENTE después de éxito
      setModalAbierto(false);
      setPaqueteEnProceso(null);

    } catch (error) {
      console.error("❌ Error al completar entrega:", error);
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

  if (!mapLoaded) return <p>Cargando mapa...</p>;

  // ░░ SIN RUTA
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

  const mapCenter = geometry.length > 0 ? geometry[0] : [4.65, -74.1];

  // Handler para finalizar ruta manualmente
  const handleFinalizarRuta = async () => {
    if (!ruta) return;

    const confirmar = window.confirm(
      "¿Estás seguro de finalizar la ruta? Esta acción liberará el vehículo y tu estado volverá a 'Disponible'."
    );

    if (!confirmar) return;

    setCerrandoRuta(true);
    try {
      await cerrarRutaService(ruta.id_ruta);
      console.log("✅ Ruta cerrada exitosamente");
      alert("Ruta finalizada correctamente. Conductor y vehículo liberados.");
      window.location.reload();
    } catch (error) {
      console.error("❌ Error al cerrar ruta:", error);
      alert("Error al finalizar la ruta: " + (error.response?.data?.error || error.message));
    } finally {
      setCerrandoRuta(false);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>

      {/* ░░ MAPA */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(m) => (mapRef.current = m)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {geometry.length > 0 && <PolylineRuta geometry={geometry} />}
        {paquetes.length > 0 && <MarcadoresPaquetes paquetes={paquetes} />}

        {(posicionActual || conductorUbic) && (
          <MarkerConductor
            lat={posicionActual ? posicionActual.lat : Number(conductorUbic.lat)}
            lng={posicionActual ? posicionActual.lng : Number(conductorUbic.lng)}
            nombre={ruta.conductor_nombre}
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
        size="sm"
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

      {/* ░░ MENSAJE DE RUTA COMPLETADA */}
      {estado === "finished" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "30px 40px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            zIndex: 10000,
            textAlign: "center",
            minWidth: "380px"
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "15px" }}>🎉</div>
          <h2 style={{
            color: "#16a34a",
            marginBottom: "10px",
            fontSize: "26px",
            fontWeight: "bold"
          }}>
            ¡Todos los paquetes procesados!
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "8px", fontSize: "15px" }}>
            {ruta?.paquetes_entregados || 0} entregados · {ruta?.paquetes_fallidos || 0} fallidos
          </p>
          <p style={{ color: "#9ca3af", marginBottom: "25px", fontSize: "13px" }}>
            Presiona "Finalizar ruta" para liberar tu estado y vehículo
          </p>

          <button
            onClick={handleFinalizarRuta}
            disabled={cerrandoRuta}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: cerrandoRuta ? "#9ca3af" : "#2563eb",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: cerrandoRuta ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"
            }}
            onMouseEnter={(e) => !cerrandoRuta && (e.target.style.background = "#1d4ed8")}
            onMouseLeave={(e) => !cerrandoRuta && (e.target.style.background = "#2563eb")}
          >
            {cerrandoRuta ? "Finalizando..." : "🏁 Finalizar ruta"}
          </button>
        </div>
      )}

    </div>
  );
}