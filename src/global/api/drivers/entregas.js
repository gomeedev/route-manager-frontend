import axios from "axios";
import { API_URL } from "../../config/api";

export const marcarEntregaService = async (rutaId, formData) => {
    const form = new FormData();
    form.append("paquete", formData.paquete);
    form.append("estado", formData.estado);
    form.append("lat_entrega", formData.lat_entrega);
    form.append("lng_entrega", formData.lng_entrega);
    
    if (formData.foto) {
        form.append("foto", formData.foto);
    }
    if (formData.observacion) {
        form.append("observacion", formData.observacion);
    }

    const res = await axios.post(
        `${API_URL}/api/v1/rutas/${rutaId}/marcar_entrega/`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
};