// src/global/api/drivers/cerrarRuta.js
import axios from "axios";
import { API_URL } from "../../config/api";

export const cerrarRutaService = async (rutaId) => {
    const res = await axios.post(
        `${API_URL}/api/v1/rutas/${rutaId}/cerrar_ruta/`
    );
    return res.data;
};