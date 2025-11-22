import { API_URL } from "../../config/api";

import axios from "axios";


// Ver todas los vehiculos para el módulo de gestion de vehiculos
export const GetVehiclesManagement = async () => {

    try {

        const response = await axios.get(`${API_URL}/api/v1/vehiculos`)

        return response.data
        
    } catch (error) {

        console.log(error.response?.data || error)
        throw error;
    }
};
