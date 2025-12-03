import { API_URL } from "../../config/api";
import axios from "axios";


// Asignar paquetes a una ruta
export const calcularRuta = async (id_ruta) => {

  try {

    const response = await axios.post(`${API_URL}/api/v1/rutas/${id_ruta}/calcular_ruta/`,

    )
    return response

  } catch (error) {

    console.log(error.response?.data)
    throw error
  }
}