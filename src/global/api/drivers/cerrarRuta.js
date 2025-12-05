// src/global/api/drivers/cerrarRuta.js
import axios from "axios";
import { API_URL } from "../../config/api";

export const cerrarRutaService = async (rutaId) => {
  try {
    const res = await axios.post(`${API_URL}/api/v1/rutas/${rutaId}/cerrar_ruta/`);
    return res.data;
  } catch (error) {
    // Si es error 400, podría ser porque ya está cerrada
    if (error.response?.status === 400) {
      throw new Error("La ruta ya está cerrada o no se puede cerrar en su estado actual");
    }
    throw error;
  }
};