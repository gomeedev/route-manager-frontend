// En tu servicio (por ejemplo: src/global/api/drivers/historialRutas.js)
import { API_URL } from "../../config/api";
import axios from "axios";


export const getHistorialRutasDriver = async (driverId) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/v1/rutas/historial_conductor/?driver_id=${driverId}`
        );
        return response.data;

    } catch (error) {

        console.log(error.response?.data || error);
        throw error;
        
    }
};