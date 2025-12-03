// /src/components/drivers/mapa/hooks/useRutaActivaPolling.js
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../../global/config/api";


export const useRutaActivaPolling = (driverId) => {
  const [ruta, setRuta] = useState(null);
  const intervalRef = useRef(null);

  const obtenerRuta = async () => {
    if (!driverId) {
      setRuta(null);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/v1/rutas/ruta_actual/?driver_id=${driverId}`, {
        validateStatus: (s) => true // manejamos manualmente estados
      });

      // 404 -> no hay ruta asignada (según tu backend)
      if (res.status === 404 || (res.data && res.data.mensaje === "No hay rutas asignadas")) {
        setRuta(null);
        return;
      }

      // 200 OK
      if (res.status >= 200 && res.status < 300) {
        setRuta(res.data);
        return;
      }

      // Otros códigos -> log y no romper UI
      setRuta(null);
    } catch (err) {
      // Error de red -> no rompas la UI, solo loggea
      console.error("useRutaActivaPolling error:", err);
      setRuta(null);
    }
  };

  useEffect(() => {
    if (!driverId) return;

    obtenerRuta(); // primera carga
    intervalRef.current = setInterval(obtenerRuta, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [driverId]);

  return ruta;
};
