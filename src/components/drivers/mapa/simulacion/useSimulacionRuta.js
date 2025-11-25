import { useEffect, useRef, useState } from "react";
import { actualizarUbicacionService } from "../../../../global/api/drivers/ubicacion";
import { marcarEntregaService } from "../../../../global/api/drivers/entregas";

/**
 * Hook de simulación avanzado y corregido.
 *
 * - Detecta el siguiente paquete pendiente por orden_entrega.
 * - Avanza por la polyline punto a punto.
 * - Actualiza backend (actualizar_ubicacion) con lat/lng correctos.
 * - Pausa cuando llega al paquete (tolerancia configurable).
 * - Llama marcarEntregaService al confirmar entrega y reanuda.
 *
 * Uso:
 * const { estado, paqueteActual, posicionActual, completarEntrega } = useSimulacionRuta(ruta, geometry, { interval: 800, toleranceKm: 0.005 });
 */

export const useSimulacionRuta = (ruta, polyline, opts = {}) => {
  const [estado, setEstado] = useState("idle");
  const [indice, setIndice] = useState(0);
  const [paqueteActual, setPaqueteActual] = useState(null);
  const [posicionActual, setPosicionActual] = useState(null);

  const intervalRef = useRef(null);

  const intervalMs = opts.interval ?? 900;
  // tolerancia en km (ej. 0.005 = 5 metros)
  const toleranceKm = opts.toleranceKm ?? 0.005;

  // Helper Haversine
  const calcularDistanciaKm = (lat1, lng1, lat2, lng2) => {
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

  // Calcula el siguiente paquete pendiente según orden_entrega
  const obtenerSiguientePaquete = () => {
    if (!ruta?.paquetes_asignados) return null;
    const pendientes = ruta.paquetes_asignados
      .filter((p) => p.estado_paquete !== "Entregado" && p.estado_paquete !== "Fallido")
      .slice()
      .sort((a, b) => (a.orden_entrega ?? 0) - (b.orden_entrega ?? 0));
    return pendientes.length > 0 ? pendientes[0] : null;
  };

  // Reiniciar cuando la ruta se inicia
  useEffect(() => {
    if (!ruta) {
      setEstado("idle");
      setIndice(0);
      setPaqueteActual(null);
      setPosicionActual(null);
      return;
    }

    if (ruta.estado === "En ruta" && Array.isArray(polyline) && polyline.length > 0) {
      setEstado("running");
      setIndice(0);
      setPaqueteActual(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta, polyline]);

  // Efecto principal: avance cuando estado === running
  useEffect(() => {
    if (estado !== "running") return;
    if (!polyline || polyline.length === 0) return;

    // seguridad: si indice fuera mayor que polyline, terminar
    if (indice >= polyline.length) {
      setEstado("finished");
      return;
    }

    intervalRef.current = setInterval(async () => {
      // punto = [lat, lng]
      const punto = polyline[indice];
      if (!punto) return;

      const lat = Number(punto[0]);
      const lng = Number(punto[1]);
      setPosicionActual({ lat, lng });

      // Actualizo backend (nota: tu endpoint espera lat,lng; mantengo ese orden)
      try {
        await actualizarUbicacionService(ruta.id_ruta, { lat, lng });
      } catch (err) {
        // no romper simulación por fallo de red
        console.warn("useSimulacionRuta: actualizarUbicacion error", err);
      }

      // Detectar siguiente paquete dinámico
      const siguiente = obtenerSiguientePaquete();
      if (siguiente && siguiente.lat != null && siguiente.lng != null) {
        const dist = calcularDistanciaKm(lat, lng, Number(siguiente.lat), Number(siguiente.lng));
        // si estamos dentro de la tolerancia, pausar y setear paqueteActual
        if (dist <= toleranceKm) {
          clearInterval(intervalRef.current);
          setPaqueteActual(siguiente);
          setEstado("paused");
          return;
        }
      }

      // Avanzar indice (si llegamos al final, marcamos finished)
      setIndice((i) => {
        const next = i + 1;
        if (next >= polyline.length) {
          clearInterval(intervalRef.current);
          setEstado("finished");
        }
        return next;
      });
    }, intervalMs);

    return () => {
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, polyline, indice, ruta?.paquetes_asignados]);

  // completarEntrega: llama al servicio, actualiza estado local del paquete y reanuda
  const completarEntrega = async (paqueteId, estadoEntrega, archivo = null) => {
    if (!ruta || !paqueteActual) return;

    try {
      // usar FormData ya que tu endpoint espera multipart
      await marcarEntregaService(ruta.id_ruta, {
        paquete: paqueteId,
        estado: estadoEntrega,
        lat_entrega: paqueteActual.lat,
        lng_entrega: paqueteActual.lng,
        foto: archivo ?? null,
      });
    } catch (err) {
      console.error("useSimulacionRuta: marcarEntrega error", err);
      // puedes decidir reintentar o notificar al usuario
    }

    // Actualizar estado localmente para evitar volver a pausar en el mismo paquete
    // Nota: no mutamos ruta directamente (es inmutable). Simplemente buscamos siguiente paq.
    setPaqueteActual(null);

    // Pequeña espera para dar tiempo al backend a propagar
    setTimeout(() => {
      // reanudar simulación
      setEstado("running");
    }, 600);
  };

  return {
    estado,
    paqueteActual,
    posicionActual,
    completarEntrega,
  };
};
