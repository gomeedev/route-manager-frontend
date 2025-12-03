import axios from "axios";
import { API_URL } from "../../config/api";


export const actualizarUbicacionService = async (rutaId, data) => {
    const res = await axios.post(
        `${API_URL}/api/v1/rutas/${rutaId}/actualizar_ubicacion/`,
        data,
        { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
};
