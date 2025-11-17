import axios from "axios"

import { API_URL } from "../../config/api"


// ver conductores para el modulo de gestion de conductores desde el admin
export const DriversManagementService = async () => {
    
    try {
        const response = await axios.get(`${API_URL}/api/v1/drivers/`);

        return response.data
    }
    catch (error) {

        console.log(error.response?.data || error);
        throw error
    }

}


// Ver detalles de conductores desde el admin
export const getDetallesConductorService = async (id_conductor) => {

    try {
        const response = await axios.get(`${API_URL}/api/v1/drivers/${id_conductor}/`)

        return response.data

    } catch (error) {

        console.log(error.response?.data || error)
        throw error

    }

}
