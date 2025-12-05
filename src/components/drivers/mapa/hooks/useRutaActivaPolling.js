// /src/components/drivers/mapa/hooks/useRutaActivaPolling.js
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../../../../global/config/api";

export const useRutaActivaPolling = (driverId) => {
  const [ruta, setRuta] = useState(null);
  const intervalRef = useRef(null);
  const pollingActivoRef = useRef(true);

  const detenerPolling = useCallback(() => {
    pollingActivoRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refrescarRuta = useCallback(async () => {
    if (!driverId || !pollingActivoRef.current) return;

    console.log("🔄 Refrescando ruta manualmente");
    await obtenerRuta();
  }, [driverId]);

  const obtenerRuta = async () => {
    if (!driverId || !pollingActivoRef.current) {
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/api/v1/rutas/ruta_actual/?driver_id=${driverId}`,
        {
          validateStatus: (s) => true,
        }
      );

      // Si el polling está desactivado, no hacemos nada
      if (!pollingActivoRef.current) return;

      // 404 -> no hay ruta asignada
      if (
        res.status === 404 ||
        (res.data && res.data.mensaje === "No hay rutas asignadas")
      ) {
        setRuta(null);
        return;
      }

      // 200 OK
      if (res.status >= 200 && res.status < 300) {
        setRuta(res.data);
        return;
      }

      // Otros códigos
      setRuta(null);
    } catch (err) {
      if (pollingActivoRef.current) {
        console.error("useRutaActivaPolling error:", err);
        setRuta(null);
      }
    }
  };

  useEffect(() => {
    if (!driverId) return;

    pollingActivoRef.current = true;
    obtenerRuta();
    intervalRef.current = setInterval(obtenerRuta, 3000);

    return () => {
      detenerPolling();
    };
  }, [driverId]);

  return { ruta, detenerPolling, refrescarRuta };
};
