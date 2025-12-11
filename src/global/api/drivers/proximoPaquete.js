// src/global/api/drivers/proximoPaquete.js
import axios from "axios";
import { API_URL } from "../../config/api";

export const obtenerProximoPaqueteService = async (rutaId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/rutas/${rutaId}/proximo_paquete/`
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo próximo paquete:", error);
    throw error;
  }
};