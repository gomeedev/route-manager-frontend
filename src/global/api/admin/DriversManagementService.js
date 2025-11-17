import axios from "axios";

import { API_URL } from "../../config/api";


// ver conductores para el modulo de gestion de conductores desde el admin
export const DriversManagementService = async () => {

  try {

      const response = await axios.get(`${API_URL}/api/v1/drivers/`);

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error);
    throw error;
  }
};


// Ver detalles de conductores desde el admin
export const getDetallesConductorService = async (id_conductor) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/drivers/${id_conductor}/`
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error);
    throw error;
  }
};


// Editar informacion de conductores desde el admin
export const EditConductorService = async (id_conductor, driverData) => {

    try {
        const payload = {
            conductor_detalle: {
                nombre: driverData.nombre,
                apellido: driverData.apellido,
                telefono_movil: driverData.telefono_movil,
                tipo_documento: driverData.tipo_documento,
                documento: driverData.documento,
                correo: driverData.correo,
                estado: driverData.estadoUsuario
            }
        };

        const response = await axios.patch(`${API_URL}/api/v1/drivers/${id_conductor}/`, payload)
        return response.data

    } catch (error) {
      
        console.log("Error completo:", error.response?.data || error)
        throw error
    }
}