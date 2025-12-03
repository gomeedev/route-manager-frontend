import { API_URL } from "../../config/api";
import axios from "axios";


// Iniciar ruta para el driver
export const iniciarRutaService = async (id_ruta) => {

  try {

    const response = await axios.post(`${API_URL}/api/v1/rutas/${id_ruta}/iniciar_ruta/`,

    )
    return response

  } catch (error) {

    console.log(error.response?.data)
    throw error
  }
}