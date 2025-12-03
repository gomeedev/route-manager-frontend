import { useEffect, useState } from "react";
import { formatearGeometry } from "../utils/formatearGeometry";
// IMPORTA tu servicio real (ajusta la ruta si tu service está en otro lugar)
import { mostrarRutaActualService } from "../../../../global/api/drivers/rutaActual";

export function useRutaActiva(conductorId = null) {
  const [ruta, setRuta] = useState(null);
  const [paquetes, setPaquetes] = useState([]);
  const [geometry, setGeometry] = useState([]);
  const [conductor, setConductor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRuta = async (idConductor) => {
    setLoading(true);
    setError(null);
    try {
      // Si ya tienes un servicio que acepta conductorId, pásalo
      const res = await mostrarRutaActualService(idConductor);
      // Si tu servicio devuelve { mensaje: "No hay rutas asignadas" } lo manejamos:
      if (!res || res.mensaje === "No hay rutas asignadas") {
        setRuta(null);
        setPaquetes([]);
        setGeometry([]);
        setConductor(null);
        return;
      }

      // Respuesta esperada: objeto ruta con campos (ruta_optimizada, paquetes, conductor, etc.)
      const r = res;
      setRuta(r);

      // Paquetes: soporta varios nombres posibles
      const p = r.paquetes || r.paquetes_asignados || r.paquetesAsignados || [];
      setPaquetes(p);

      // Geometry: puede venir como r.ruta_optimizada.geometry (GeoJSON) o como ruta_optimizada.geometry.coordinates
      const geom =
        (r.ruta_optimizada &&
          (r.ruta_optimizada.geometry || r.ruta_optimizada)) ||
        (r.geometry && r.geometry) ||
        null;

      const formated = geom ? formatearGeometry(geom) : [];
      setGeometry(formated);

      // Conductor: crear objeto con position si hay ubicación
      if (r.conductor) {
        const lat = r.conductor.ubicacion_actual_lat;
        const lng = r.conductor.ubicacion_actual_lng;

        setConductor({
          ...r.conductor,
          position: lat && lng ? [parseFloat(lat), parseFloat(lng)] : null,
        });
      } else {
        setConductor(null);
      }
    } catch (err) {
      console.error("useRutaActiva error:", err);
      setError(err);
      setRuta(null);
      setPaquetes([]);
      setGeometry([]);
      setConductor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Si quieres, puedes pasar conductorId al hook o dejar que el caller lo gestione.
    // Si conductorId es null, se asume que el servicio deduce el conductor por el user token.
    fetchRuta(conductorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conductorId]);

  return {
    ruta,
    paquetes,
    geometry,
    conductor,
    loading,
    error,
    refresh: () => fetchRuta(conductorId),
  };
}
