import axios from "axios";

import { API_URL } from "../../config/api";


// Ver rutas para el modulo de gestión de rutas del admin
export const GetRoutesManagementService = async () => {

  try {

    const response = await axios.get(`${API_URL}/api/v1/rutas`);

    const estadosPermitidos = ["En ruta", "Pendiente", "Asignada"];

    const rutasFiltradas = response.data.filter((ruta) =>
      estadosPermitidos.includes(ruta.estado)
    );

    return rutasFiltradas;

  } catch (error) {

    console.log(error.response?.data || error);
    throw error;

  }
};


// Ver rutas para el módulo de historial de rutas
export const GetRoutesHistoryService = async () => {

  try {

    const response = await axios.get(`${API_URL}/api/v1/rutas`);

    const estadosPermitidos = ["Completada", "Fallida"];

    const rutasFiltradas = response.data.filter((ruta) =>
      estadosPermitidos.includes(ruta.estado)
    );

    return rutasFiltradas;

  } catch (error) {

    console.log(error.response?.data || error);
    throw error;

  }
};


// Ver detalles de la ruta para el módulo de gestion de rutas
export const GetDetailsRoutesManagement = async (id_ruta) => {

  try {

    const response = await axios.get(`${API_URL}/api/v1/rutas/${id_ruta}/`)
    return response.data

  } catch (error) {

    console.log(error.response?.data || error);
    throw error
  }
}


// Agregar rutas para el modulo de gestion de rutas
export const PostRoutesService = async () => {

  try {

    const response = await axios.post(`${API_URL}/api/v1/rutas/`)
    return response.data

  } catch(error) {

    console.log(error.response?.data)
    throw error
  }
}


// Eliminar ruta para el modulo de gestión de rutas
export const DeleteRoutesService = async (id_ruta) => {

  try {

    const response = await axios.delete(`${API_URL}/api/v1/rutas/${id_ruta}/`)
    return response.data

  } catch(error) {

    console.log(error.response?.data)
    throw error
  }
}


// ver y dercagar el pdf del historial de rutas
export const ExportarPdfRutaService = async (id_ruta) => {

    try {

        const response = await axios.get(`${API_URL}/api/v1/rutas/${id_ruta}/exportar_pdf/`, { responseType: "blob" });
        return response;

    } catch (error) {

        console.log(error);
        throw error;

    }
};


// Asignar conductor a una ruta
export const AsignarConductorService = async (id_ruta, conductor) => {

  try {

    const response = await axios.post(`${API_URL}/api/v1/rutas/${id_ruta}/asignar_conductor/`, 
      {conductor}
    )
    return response

  } catch (error) {

    console.log(error)
    throw error
  }
}


// Asignar paquetes a una ruta
export const AsignarPaqueteService = async (id_ruta, paquetes) => {

  try {

    const response = await axios.post(`${API_URL}/api/v1/rutas/${id_ruta}/asignar_paquetes/`,
      {paquetes}
    )

    return response

  } catch (error) {

    console.log(error.response?.data)
    throw error
  }
}


// Resignar paquetes a una ruta
export const ReasignarPaqueteService = async (paquete_id, ruta_destino_id) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/rutas/reasignar_paquete_fallido/`,
      { 
        paquete: paquete_id,
        ruta_destino: ruta_destino_id
      }
    );

    return response.data;

  } catch (error) {
    console.log(error.response?.data);
    throw error;
  }
};