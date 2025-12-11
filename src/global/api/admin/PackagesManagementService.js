import { API_URL } from "../../config/api";

import axios from "axios";


// Ver paquetes para el módulo de gestion de paquetes
export const GetPackagesManagementService = async () => {

    try {

        const response = await axios.get(`${API_URL}/api/v1/paquetes/`)

        return response.data
        
    } catch (error) {

        console.log(error.response?.data || error)
        throw error;
    }
};


// Ver detalles del paquetes para el modulo de gestion de paquetes
export const GetDetallesPaquetesService = async (id_paquete) => {
    try {

        const response = await axios.get(`${API_URL}/api/v1/paquetes/${id_paquete}/`)
        return response.data

    } catch(error) {

        console.log(error.response?.data || error)
        throw error

    }

}


// Crear paquetes para el módulo de gestion de paquetes
export const PostPackagesManagementService = async (paquete) => {

    try {

        const response = await axios.post(`${API_URL}/api/v1/paquetes/`, paquete)

        return response.data
        
    } catch (error) {

        console.log(error.response?.data || error)
        throw error;
    }
};


// Editar paquetes para el modulode gestion de paquetes
export const EditPackagesManagementService = async (id_paquete, paqueteData) => {

    try {

        const response = await axios.patch(`${API_URL}/api/v1/paquetes/${id_paquete}/`, paqueteData)
        return response.data

    } catch(error) {

        console.log(error.response?.data || error)
        throw error;
    }
}


// Eliminar paquetes para el modulo de gestión de paquetes
export const DeletePackagesManagementService = async (id_paquete) => {

    try {

        const response = await axios.delete(`${API_URL}/api/v1/paquetes/${id_paquete}/`)
        return response.data

    } catch(error) {

        console.log(error.response?.data || error)
        throw error;

    }
}