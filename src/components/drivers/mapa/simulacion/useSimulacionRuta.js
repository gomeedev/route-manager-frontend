import { useEffect, useRef, useState, useCallback } from "react";
import { actualizarUbicacionService } from "../../../../global/api/drivers/ubicacion";
import { marcarEntregaService } from "../../../../global/api/drivers/entregas";

export const useSimulacionRuta = (ruta, polyline, opts = {}) => {
  const [estado, setEstado] = useState("idle");
  const [indice, setIndice] = useState(0);
  const [paqueteActual, setPaqueteActual] = useState(null);
  const [posicionActual, setPosicionActual] = useState(null);

  const intervalRef = useRef(null);

  const intervalMs = opts.interval ?? 300;
  const toleranceKm = opts.toleranceKm ?? 0.15;

  // NUEVO: Estado local para optimistic updates (evita race conditions)
  const [paquetesProcesados, setPaquetesProcesados] = useState({});

  // Distancia Haversine en km
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

  // Modificar obtenerSiguientePaquete para usar optimistic state
  const obtenerSiguientePaquete = () => {
    if (!ruta?.paquetes_asignados) {
      return null;
    }

    const pendientes = ruta.paquetes_asignados
      .filter((p) => {
        const esPendiente =
          !paquetesProcesados[p.id_paquete] && // Optimistic check primero
          p.estado_paquete !== "Entregado" &&
          p.estado_paquete !== "Fallido";
        return esPendiente;
      })
      .sort((a, b) => a.orden_entrega - b.orden_entrega);

    const siguiente = pendientes[0] ?? null;
    if (siguiente) {
      console.log();
    } else {
      console.log("No quedan paquetes pendientes");
    }

    return siguiente;
  };

  // Inicializar simulación
  useEffect(() => {
    if (!ruta) {
      console.log("No hay ruta disponible");
      return;
    }
    if (estado === "finished") {
      console.log("Simulación ya terminó");
      return;
    }
    if (ruta.estado !== "En ruta") {
      console.log(`⚠️ Ruta no está "En ruta", estado actual: ${ruta.estado}`);
      return;
    }
    if (!polyline || polyline.length === 0) {
      console.log("⚠️ Polyline vacía");
      return;
    }
    if (estado === "running") {
      console.log("Simulación ya corriendo");
      return;
    }

    console.log("Iniciando simulación con", polyline.length, "puntos");
    setEstado("running");
    setIndice(0);
  }, [ruta, polyline, estado]);

  // Loop de simulación
  // Loop de simulación — VERSIÓN CORREGIDA
  useEffect(() => {
    if (estado !== "running") return;
    if (!polyline || polyline.length === 0) return;
    if (indice >= polyline.length - 1) {
      setEstado("finished");
      return;
    }

    intervalRef.current = setInterval(() => {
      setIndice((prev) => {
        const nuevoIndice = prev + 5;

        // Si ya llegamos al final → terminar
        if (nuevoIndice >= polyline.length - 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setEstado("finished");
          return polyline.length - 1;
        }

        const punto = polyline[nuevoIndice];
        const lat = punto[0];
        const lng = punto[1];

        setPosicionActual({ lat, lng });

        // Actualizar backend
        actualizarUbicacionService(ruta.id_ruta, { lat, lng }).catch(
          console.error
        );

        // Detección de llegada
        const siguiente = obtenerSiguientePaquete();
        if (siguiente) {
          const dist = calcularDistanciaKm(
            lat,
            lng,
            Number(siguiente.lat),
            Number(siguiente.lng)
          );
          if (dist < toleranceKm) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setPaqueteActual(siguiente);
            setEstado("paused");
            // ← Aquí ya no sigue avanzando nunca más
            return prev; // no incrementar más
          }
        }

        return nuevoIndice;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [estado, polyline, ruta, toleranceKm, intervalMs]);

  // Modificar completarEntrega con optimistic update
  const completarEntrega = useCallback(
    async (paqueteId, estadoEntrega, archivo, observacion = "") => {
      if (!ruta || !paqueteActual) return;

      const paqueteEnRuta = ruta.paquetes_asignados.find(
        (p) => p.id_paquete === paqueteActual.id_paquete
      );

      if (
        paqueteEnRuta &&
        (paqueteEnRuta.estado_paquete === "Entregado" ||
          paqueteEnRuta.estado_paquete === "Fallido")
      ) {
        setPaqueteActual(null);
        setEstado("running");
        setIndice((prev) => Math.max(0, prev - 10));
        return;
      }

      // OPTIMISTIC: Marca como procesado LOCALMENTE antes del POST
      setPaquetesProcesados((prev) => ({
        ...prev,
        [paqueteActual.id_paquete]: true,
      }));

      try {
        await marcarEntregaService(ruta.id_ruta, {
          paquete: paqueteActual.id_paquete,
          estado: estadoEntrega,
          foto: archivo,
          observacion: observacion,
          lat_entrega: paqueteActual.lat,
          lng_entrega: paqueteActual.lng,
        });

        // CALCULAR con datos actualizados (usa optimistic para quedanPendientes)
        const paquetesActualizados = ruta.paquetes_asignados.map((p) =>
          p.id_paquete === paqueteActual.id_paquete
            ? { ...p, estado_paquete: estadoEntrega }
            : p
        );

        const quedanPendientes = paquetesActualizados.some(
          (p) =>
            !paquetesProcesados[p.id_paquete] && // Usa optimistic
            p.estado_paquete !== "Entregado" &&
            p.estado_paquete !== "Fallido"
        );

        console.log("¿Quedan paquetes pendientes?", quedanPendientes);

        if (!quedanPendientes) {
          console.log(
            "Todos los paquetes procesados. Driver debe finalizar manualmente."
          );
          setEstado("finished");
          setPaqueteActual(null);
          return;
        }

        console.log("Reanudando simulación...");
        setPaqueteActual(null);
        setEstado("running");
      } catch (err) {
        // ROLLBACK optimistic si falla
        setPaquetesProcesados((prev) => {
          const nuevo = { ...prev };
          delete nuevo[paqueteActual.id_paquete];
          return nuevo;
        });

        console.error("Error completando entrega:", err);
        const errorMsg =
          err.response?.data?.error ||
          err.response?.data?.non_field_errors?.[0] ||
          "Error desconocido";
        alert(`Error al registrar la entrega: ${errorMsg}`);
      }
    },
    [ruta, paqueteActual, paquetesProcesados]
  ); // Dependencias para memo

  useEffect(() => {
    if (paqueteActual) {
      console.log("PAQUETE ACTUAL ESTABLECIDO:", paqueteActual);
    } else {
      console.log("PAQUETE ACTUAL LIMPIADO");
    }
  }, [paqueteActual]);

  return {
    estado,
    paqueteActual,
    posicionActual,
    completarEntrega,
  };
};
