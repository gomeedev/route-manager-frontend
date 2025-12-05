import { useEffect, useRef, useState, useCallback } from "react";
import { actualizarUbicacionService } from "../../../../global/api/drivers/ubicacion";
import { marcarEntregaService } from "../../../../global/api/drivers/entregas";
import { obtenerProximoPaqueteService } from "../../../../global/api/drivers/proximoPaquete";
import { obtenerProgresoRutaService } from "../../../../global/api/drivers/progreso";

export const useSimulacionRuta = (ruta, polyline, opts = {}, resetKey = 0) => {
  const [estado, setEstado] = useState("loading");
  const [paqueteActual, setPaqueteActual] = useState(null);
  const [posicionActual, setPosicionActual] = useState(null);
  const [siguientePaquete, setSiguientePaquete] = useState(null);

  const intervalRef = useRef(null);
  const indiceRef = useRef(0);

  // Refs críticos para evitar bucles
  const rutaIdRef = useRef(null);
  const inicializadoRef = useRef(false);
  const polylineRef = useRef([]);
  const siguientePaqueteRef = useRef(null);

  const intervalMs = opts.interval ?? 300;
  const toleranceKm = opts.toleranceKm ?? 0.25; // Cambiado a 0.25 km


  // Efecto para resetear cuando cambia resetKey
  useEffect(() => {
    if (resetKey > 0) {
      console.log(`🔄 Reset key cambiada: ${resetKey}, reiniciando simulación`);

      // Resetear todos los refs
      rutaIdRef.current = null;
      inicializadoRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      indiceRef.current = 0;

      // Resetear estados
      setEstado("loading");
      setPaqueteActual(null);
      setPosicionActual(null);
      setSiguientePaquete(null);
    }
  }, [resetKey]);


  // Sincronizar polyline con ref
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

  // INICIALIZAR
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

        // ✅ Convertir coordenadas a número
        if (siguiente) {
          siguiente.lat = parseFloat(siguiente.lat);
          siguiente.lng = parseFloat(siguiente.lng);

          if (isNaN(siguiente.lat) || isNaN(siguiente.lng)) {
            console.error("❌ Coordenadas inválidas:", siguiente);
            setEstado("idle");
            return;
          }
        }

        setSiguientePaquete(siguiente);

        // 4. Marcar como inicializado
        inicializadoRef.current = true;

        if (!siguiente) {
          console.log("🏁 Sin paquetes pendientes");
          setEstado("finished");
        } else if (ruta.estado === "En ruta") {
          console.log(`✅ Listo. Próximo: #${siguiente.id_paquete}`, {
            lat: siguiente.lat,
            lng: siguiente.lng,
            tipo_lat: typeof siguiente.lat,
            tipo_lng: typeof siguiente.lng,
          });
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
  }, [ruta?.id_ruta, resetKey]);

  // LOOP DE SIMULACIÓN
  useEffect(() => {
    if (estado !== "running") {
      return;
    }

    if (polylineRef.current.length === 0 || !siguientePaqueteRef.current) {
      console.warn("⚠️ Sin polyline o paquete");
      return;
    }

    if (intervalRef.current !== null) {
      console.warn("⚠️ Ya hay un intervalo activo");
      return;
    }

    console.log("▶️ Iniciando loop de simulación");

    intervalRef.current = setInterval(() => {
      const poly = polylineRef.current;
      const siguiente = siguientePaqueteRef.current;

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

      // ✅ CALCULAR DISTANCIA PRIMERO
      const distancia = calcularDistanciaKm(
        punto[0],
        punto[1],
        siguiente.lat,
        siguiente.lng
      );

      // Log cada 20 iteraciones
      if (nuevoIndice % 20 === 0) {
        console.log(
          `📍 Posición actual: [${punto[0].toFixed(6)}, ${punto[1].toFixed(6)}]`
        );
        console.log(
          `📦 Paquete objetivo: [${siguiente.lat}, ${siguiente.lng}]`
        );
        console.log(
          `📏 Distancia: ${distancia.toFixed(
            4
          )} km | Tolerancia: ${toleranceKm} km`
        );
      }

      // Actualizar backend (sin esperar respuesta)
      if (ruta?.id_ruta) {
        actualizarUbicacionService(ruta.id_ruta, {
          lat: punto[0],
          lng: punto[1],
        }).catch(() => {});
      }

      // ✅ VERIFICAR LLEGADA
      if (distancia <= toleranceKm) {
        console.log(
          `🎯 ¡LLEGASTE! Paquete #${siguiente.id_paquete} (${distancia.toFixed(
            4
          )} km)`
        );
        console.log(
          "🔍 Verificando si el intervalo está activo:",
          intervalRef.current !== null
        );

        // DETENER INMEDIATAMENTE
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        // Cambiar estado
        setEstado("paused");
        console.log("📝 Estado cambiado a 'paused'");

        // Establecer paquete actual
        setPaqueteActual(siguiente);
        console.log("📦 Paquete actual establecido:", siguiente.id_paquete);
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
  }, [estado, ruta?.id_ruta, intervalMs, toleranceKm]);

  // COMPLETAR ENTREGA
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
        // ✅ Convertir coordenadas a número
        const paqueteCoords = {
          lat: parseFloat(paqueteActual.lat),
          lng: parseFloat(paqueteActual.lng),
        };

        // Marcar entrega
        await marcarEntregaService(ruta.id_ruta, {
          paquete: paqueteActual.id_paquete,
          estado: estadoEntrega,
          foto: archivo,
          observacion,
          lat_entrega: paqueteCoords.lat,
          lng_entrega: paqueteCoords.lng,
        });

        console.log(`✅ Entrega registrada`);

        // Limpiar
        setPaqueteActual(null);

        // Obtener siguiente
        const respuesta = await obtenerProximoPaqueteService(ruta.id_ruta);
        const nuevoSiguiente = respuesta.proximo || null;

        if (nuevoSiguiente) {
          // ✅ Convertir coordenadas
          nuevoSiguiente.lat = parseFloat(nuevoSiguiente.lat);
          nuevoSiguiente.lng = parseFloat(nuevoSiguiente.lng);
        }

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
