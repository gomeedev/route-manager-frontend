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


// ver detalles de un vehiculo
export const getVehiclesDetalles = async (id_vehiculo) => {

  try {

    const response = await axios.get(`${API_URL}/api/v1/vehiculos/${id_vehiculo}/`);
    return response.data;

  } catch (error) {

    console.log(error.response?.data || error);
    throw error;

  }
};


// Agregar vehiculos para el módulo de gestión de vehiculos
export const PostVehiclesManagement = async (formData) => {

    try {

        const response = await axios.post(`${API_URL}/api/v1/vehiculos/`, formData)
        return response.data

    } catch(error) {

        console.log(error.response?.data || error)
        throw error
    }

}


// Editar vehiculos para el módulo de gestión de vehiculos
export const EditVehiclesManagement = async (id_vehiculo, vehicleData) => {

    try {

        const response = await axios.patch(`${API_URL}/api/v1/vehiculos/${id_vehiculo}/`, vehicleData)
        return response.data

    } catch(error) {

        console.log(error.response?.data || error)
        throw error
    }

}


// Eliminar vehiculos para el módulo de gestión de vehiculos
export const DeleteVehiculo = async (id_vehiculo) => {

    try {
        const response = await axios.delete(`${API_URL}/api/v1/vehiculos/${id_vehiculo}/`);
        return response.data

    } catch (error) {

        console.log(error.response?.data || error)
        throw error

    }
}