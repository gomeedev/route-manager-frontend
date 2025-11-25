import { useEffect, useRef, useState } from "react";
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


  const obtenerSiguientePaquete = () => {
    if (!ruta?.paquetes_asignados) {
      return null;
    }

    const pendientes = ruta.paquetes_asignados
      .filter((p) => {
        const esPendiente =
          p.estado_paquete !== "Entregado" && p.estado_paquete !== "Fallido";
        console.log(
        );
        return esPendiente;
      })
      .sort((a, b) => a.orden_entrega - b.orden_entrega);

    const siguiente = pendientes[0] ?? null;
    if (siguiente) {
      console.log(
      );
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
  useEffect(() => {
    if (estado !== "running") return;
    if (!polyline || polyline.length === 0) return;

    if (indice >= polyline.length) {
      console.log("Llegamos al final de la polyline");
      setEstado("finished");
      return;
    }

    intervalRef.current = setInterval(async () => {
      const punto = polyline[indice];
      if (!punto) return;

      const lat = punto[0];
      const lng = punto[1];
      setPosicionActual({ lat, lng });


      // Actualizar ubicación en backend
      try {
        await actualizarUbicacionService(ruta.id_ruta, { lat, lng });
      } catch (err) {
        console.error("❌ Error actualizando ubicación:", err);
      }

      // 🔍 DETECTOR DE PROXIMIDAD (con datos frescos)
      const siguiente = obtenerSiguientePaquete();

      if (siguiente) {
        const dist = calcularDistanciaKm(
          lat,
          lng,
          Number(siguiente.lat),
          Number(siguiente.lng)
        );


        if (dist < toleranceKm) {
          console.log(
            `Se llego al paquete #${siguiente.id_paquete}`
          );

          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setPaqueteActual(siguiente);
          setEstado("paused");
          return;
        }
      }

      setIndice((i) => i + 5);
    }, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [estado, indice, polyline, ruta]);


  const completarEntrega = async (
    paqueteId,
    estadoEntrega,
    archivo,
    observacion = ""
  ) => {
    if (!ruta || !paqueteActual) {
      return;
    }

    // ✅ VALIDACIÓN EXTRA: Verificar que el paquete no esté ya procesado
    const paqueteEnRuta = ruta.paquetes_asignados.find(
      (p) => p.id_paquete === paqueteActual.id_paquete
    );

    if (paqueteEnRuta && (paqueteEnRuta.estado_paquete === "Entregado" || paqueteEnRuta.estado_paquete === "Fallido")) {
      setPaqueteActual(null);
      setEstado("running");
      return;
    }


    try {
      const respuesta = await marcarEntregaService(ruta.id_ruta, {
        paquete: paqueteActual.id_paquete,
        estado: estadoEntrega,
        foto: archivo,
        observacion: observacion,
        lat_entrega: paqueteActual.lat,
        lng_entrega: paqueteActual.lng,
      });

      // ✅ CALCULAR con datos actualizados del backend
      const paquetesActualizados = ruta.paquetes_asignados.map((p) =>
        p.id_paquete === paqueteActual.id_paquete
          ? { ...p, estado_paquete: estadoEntrega }
          : p
      );

      const quedanPendientes = paquetesActualizados.some(
        (p) =>
          p.estado_paquete !== "Entregado" && p.estado_paquete !== "Fallido"
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
      console.error("Error completando entrega:", err);
      
      // MEJORAR MENSAJE DE ERROR
      const errorMsg = err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || "Error desconocido";
      alert(`Error al registrar la entrega: ${errorMsg}`);
    }
  };

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