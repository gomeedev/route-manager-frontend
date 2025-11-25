import { useEffect, useRef, useState } from "react";
import { actualizarUbicacionService } from "../../../../global/api/drivers/ubicacion";
import { marcarEntregaService } from "../../../../global/api/drivers/entregas";

/**
 * Hook de simulación para mover al conductor sobre la polyline
 * punto por punto.
 *
 * Estados:
 * - "idle" → ruta no iniciada
 * - "running" → avanzando sobre polyline
 * - "paused" → esperando formulario de entrega
 * - "finished" → ruta completada
 */

export const useSimulacionRuta = (ruta, polyline) => {
  const [estado, setEstado] = useState("idle");
  const [indice, setIndice] = useState(0);
  const [paqueteActual, setPaqueteActual] = useState(null);
  const [posicionActual, setPosicionActual] = useState(null);

  const intervalRef = useRef(null);

  // 👉 Inicializa simulación cuando ruta.estado === "En ruta"
  useEffect(() => {
    console.log("🔥 Estado simulación:", estado);
    console.log("🔥 Ruta estado:", ruta?.estado);
    console.log("🔥 Polyline length:", polyline?.length);
    if (!ruta) return;

    if (ruta.estado === "En ruta" && polyline?.length > 0) {
      console.log("✅ INICIANDO SIMULACIÓN");
      setEstado("running");
      setIndice(0);
    }
  }, [ruta, polyline]);

  // 👉 Avance automático
  useEffect(() => {
    if (estado !== "running") return;
    if (!polyline || polyline.length === 0) return;

    intervalRef.current = setInterval(async () => {
      const punto = polyline[indice];
      console.log("🚚 Enviando al backend:", { lat: punto[0], lng: punto[1] });
      if (!punto) return;

      setPosicionActual({lat: punto[0], lng: punto[1]})

      // 1. Actualizar ubicación del conductor
      try {
        await actualizarUbicacionService(ruta.id_ruta, {
          lat: punto[1],
          lng: punto[0],
        });
      } catch (err) {
        console.warn("No se pudo actualizar ubicación:", err);
      }

      // 2. Avanzar al siguiente punto
      setIndice((i) => {
        const next = i + 1;

        // 🔥 Detectar si este punto coincide con el del próximo paquete
        const siguientePaquete = ruta.paquetes_asignados.find(
          (p) => p.orden_entrega === 1
        );

        if (siguientePaquete) {
          const distancia = calcularDistancia(
            punto[1],
            punto[0],
            Number(siguientePaquete.lat),
            Number(siguientePaquete.lng)
          );

          if (distancia < 0.03) {
            clearInterval(intervalRef.current);
            setEstado("paused");
            setPaqueteActual(siguientePaquete);
          }
        }

        // Si llegamos al final → terminar ruta
        if (next >= polyline.length) {
          clearInterval(intervalRef.current);
          setEstado("finished");
        }

        return next;
      });
    }, 900);

    return () => clearInterval(intervalRef.current);
  }, [estado, polyline, indice]);

  const calcularDistancia = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // 👉 Función para registrar entrega y continuar
  const completarEntrega = async (paqueteId, estadoEntrega, archivo) => {
    if (!ruta || !paqueteActual) return;

    await marcarEntregaService(ruta.id_ruta, {
      paquete: paqueteActual.id_paquete,
      estado: estadoEntrega,
      foto: archivo,
      lat_entrega: paqueteActual.lat,
      lng_entrega: paqueteActual.lng,
    });

    // 🔥 Continuar simulación
    setPaqueteActual(null);
    setEstado("running");
  };

  return {
    estado,
    paqueteActual,
    posicionActual,
    completarEntrega,
  };
};
