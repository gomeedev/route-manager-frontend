import { useEffect, useRef, useState, useCallback } from "react";
import { actualizarUbicacionService } from "../../../../global/api/drivers/ubicacion";
import { marcarEntregaService } from "../../../../global/api/drivers/entregas";
import { obtenerProximoPaqueteService } from "../../../../global/api/drivers/proximoPaquete";
import { obtenerProgresoRutaService } from "../../../../global/api/drivers/progreso";

export const useSimulacionRuta = (ruta, polyline, opts = {}) => {
  const [estado, setEstado] = useState("loading");
  const [paqueteActual, setPaqueteActual] = useState(null);
  const [posicionActual, setPosicionActual] = useState(null);
  const [siguientePaquete, setSiguientePaquete] = useState(null);

  const intervalRef = useRef(null);
  const indiceRef = useRef(0);

  // Refs críticos para evitar bucles
  const rutaIdRef = useRef(null);
  const inicializadoRef = useRef(false);
  const polylineRef = useRef([]); // ← NUEVO: Guardar polyline en ref
  const siguientePaqueteRef = useRef(null); // ← NUEVO

  const intervalMs = opts.interval ?? 300;
  const toleranceKm = opts.toleranceKm ?? 0.15;

  // Sincronizar polyline con ref (sin re-renders)
  useEffect(() => {
    if (polyline && polyline.length > 0) {
      polylineRef.current = polyline;
    }
  }, [polyline]);

  // Sincronizar siguientePaquete con ref
  useEffect(() => {
    siguientePaqueteRef.current = siguientePaquete;
  }, [siguientePaquete]);

  // Distancia Haversine
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

  // 🆕 INICIALIZAR - SOLO UNA VEZ
  useEffect(() => {
    if (
      !ruta?.id_ruta ||
      rutaIdRef.current === ruta.id_ruta ||
      inicializadoRef.current
    ) {
      return;
    }

    const inicializarSimulacion = async () => {
      try {
        console.log(`🚀 Inicializando simulación para ruta ${ruta.id_ruta}`);
        setEstado("loading");
        rutaIdRef.current = ruta.id_ruta;

        // 1. Obtener progreso
        const progreso = await obtenerProgresoRutaService(ruta.id_ruta);
        console.log("📊 Progreso:", {
          total: progreso.total_paquetes,
          entregados: progreso.paquetes_entregados,
          fallidos: progreso.paquetes_fallidos,
        });

        // 2. Calcular índice inicial
        const totalEntregados =
          progreso.paquetes_entregados + progreso.paquetes_fallidos;

        if (totalEntregados > 0 && polylineRef.current.length > 0) {
          const porcentaje = totalEntregados / progreso.total_paquetes;
          indiceRef.current = Math.floor(
            polylineRef.current.length * porcentaje
          );
          console.log(`📍 Iniciando en índice ${indiceRef.current}`);
        } else {
          indiceRef.current = 0;
        }

        // 3. Obtener próximo paquete
        const respuesta = await obtenerProximoPaqueteService(ruta.id_ruta);
        const siguiente = respuesta.proximo || null;
        setSiguientePaquete(siguiente);

        // 4. Marcar como inicializado
        inicializadoRef.current = true;

        if (!siguiente) {
          console.log("🏁 Sin paquetes pendientes");
          setEstado("finished");
        } else if (ruta.estado === "En ruta") {
          console.log(`✅ Listo. Próximo: #${siguiente.id_paquete}`);
          setEstado("running");
        } else {
          console.log(`⏸️ Estado: ${ruta.estado}`);
          setEstado("idle");
        }
      } catch (error) {
        console.error("❌ Error inicializando:", error);
        setEstado("idle");
      }
    };

    inicializarSimulacion();
  }, [ruta?.id_ruta]); // ← SOLO depende de ruta.id_ruta

  // 🆕 LOOP DE SIMULACIÓN - SIN DEPENDENCIAS PROBLEMÁTICAS
  useEffect(() => {
    // Solo iniciar cuando estado cambie a "running"
    if (estado !== "running") {
      return;
    }

    // Validar que tenemos lo necesario
    if (polylineRef.current.length === 0 || !siguientePaqueteRef.current) {
      console.warn("⚠️ Sin polyline o paquete");
      return;
    }

    // Prevenir múltiples intervalos
    if (intervalRef.current !== null) {
      console.warn("⚠️ Ya hay un intervalo activo");
      return;
    }

    console.log("▶️ Iniciando loop de simulación");

    intervalRef.current = setInterval(() => {
      const poly = polylineRef.current;
      const siguiente = siguientePaqueteRef.current;

      // Validaciones dentro del intervalo
      if (!poly || poly.length === 0 || !siguiente) {
        console.log("⏹️ Deteniendo: sin datos");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }

      // Avanzar
      const nuevoIndice = Math.min(indiceRef.current + 5, poly.length - 1);
      indiceRef.current = nuevoIndice;

      const punto = poly[nuevoIndice];
      setPosicionActual({ lat: punto[0], lng: punto[1] });

      // Actualizar backend
      if (ruta?.id_ruta) {
        actualizarUbicacionService(ruta.id_ruta, {
          lat: punto[0],
          lng: punto[1],
        }).catch(() => {});
      }

      // Verificar llegada al paquete
      const distancia = calcularDistanciaKm(
        punto[0],
        punto[1],
        Number(siguiente.lat),
        Number(siguiente.lng)
      );

      if (distancia < toleranceKm) {
        console.log(`🎯 ¡LLEGASTE! Paquete #${siguiente.id_paquete}`);

        // DETENER INMEDIATAMENTE
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        // Cambiar estado
        setEstado("paused");

        // Establecer paquete actual
        setPaqueteActual(siguiente);
      }
    }, intervalMs);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        console.log("🧹 Cleanup del loop");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [estado]); // ← SOLO depende de estado

  // 📝 COMPLETAR ENTREGA
  const completarEntrega = useCallback(
    async (paqueteId, estadoEntrega, archivo, observacion = "") => {
      if (!ruta || !paqueteActual) {
        console.error("⚠️ Sin paquete actual");
        return;
      }

      console.log(
        `📝 Marcando #${paqueteActual.id_paquete} como ${estadoEntrega}`
      );

      try {
        // Marcar entrega
        await marcarEntregaService(ruta.id_ruta, {
          paquete: paqueteActual.id_paquete,
          estado: estadoEntrega,
          foto: archivo,
          observacion,
          lat_entrega: paqueteActual.lat,
          lng_entrega: paqueteActual.lng,
        });

        console.log(`✅ Entrega registrada`);

        // Limpiar
        setPaqueteActual(null);

        // Obtener siguiente
        const respuesta = await obtenerProximoPaqueteService(ruta.id_ruta);
        const nuevoSiguiente = respuesta.proximo || null;

        if (!nuevoSiguiente) {
          console.log("🏁 ¡Completado!");
          setSiguientePaquete(null);
          setEstado("finished");
        } else {
          console.log(`📦 Siguiente: #${nuevoSiguiente.id_paquete}`);
          setSiguientePaquete(nuevoSiguiente);
          setEstado("running");
        }
      } catch (err) {
        console.error("❌ Error:", err);
        alert(err.response?.data?.error || "Error al registrar entrega");
      }
    },
    [ruta, paqueteActual]
  );

  return {
    estado,
    paqueteActual,
    posicionActual,
    siguientePaquete,
    completarEntrega,
  };
};
