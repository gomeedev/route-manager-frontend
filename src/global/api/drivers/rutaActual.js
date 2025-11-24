import { API_URL } from "../../config/api";
import axios from "axios";


// Mostrar los detalles de la ruta actual del conductor
export const mostrarRutaActualService = async (driverId) => {

    try {

        const response = await axios.get(`${API_URL}/api/v1/rutas/ruta_actual/?driver_id=${driverId}`)
        return response.data

    } catch (error) {

        console.log(error.response?.data || error)
        throw error

    }
}



export const getConductorByUserId = async (idUsuario) => {
    const response = await axios.get(
        `${API_URL}/api/v1/drivers/?usuario_id=${idUsuario}`
    );  
    return response.data[0];
};
