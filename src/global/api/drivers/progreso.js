// src/global/api/drivers/progreso.js
import axios from "axios";
import { API_URL } from "../../config/api";

/**
 * Obtiene el progreso actual de una ruta
 * Incluye: paquetes entregados, fallidos, pendientes y próximo paquete
 */
export const obtenerProgresoRutaService = async (rutaId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/rutas/${rutaId}/progreso/`
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo progreso de ruta:", error);
    throw error;
  }
};