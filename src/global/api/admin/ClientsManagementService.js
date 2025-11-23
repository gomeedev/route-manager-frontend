import axios from "axios";

import { API_URL } from "../../config/api";


// ver clientes para el modulo de gestion de clientes desde el admin
export const ClientsManagementService = async () => {

  try {
    
    const response = await axios.get(`${API_URL}/api/v1/paquetes/clientes/`);
    return response.data;

  } catch (error) {

    console.log(error.response?.data || error);
    throw error;

  }
};


// ver detalles clientes para el modulo de gestion de clientes desde el admin
export const GetClientsDetailsService = async (id_cliente) => {

  try {
    
    const response = await axios.get(`${API_URL}/api/v1/paquetes/clientes/${id_cliente}/`);
    return response.data;

  } catch (error) {

    console.log(error.response?.data || error);
    throw error;

  }
};



// crear clientes para el modulo de gestion de clientes desde el admin
export const PostClientsManagementService = async (data) => {

  try {
    
    const response = await axios.post(`${API_URL}/api/v1/paquetes/clientes/`, data);
    return response.data;

  } catch (error) {

    console.log(error.response?.data || error);
    throw error;

  }
};



// Editar informacion del cliente para modulo de gestion de clientes
export const EditClientsManagementService = async (id_cliente, clienteData) => {

  try {
    
    const response = await axios.patch(`${API_URL}/api/v1/paquetes/clientes/${id_cliente}/`, clienteData);
    return response.data;

  } catch (error) {

    console.log(error.response?.data || error);
    throw error;

  }
};


// Eliminar vehiculos para el módulo de gestión de vehiculos
export const DeleteClientsManagementService = async (id_cliente) => {

    try {
        const response = await axios.delete(`${API_URL}/api/v1/paquetes/clientes/${id_cliente}/`);
        return response.data

    } catch (error) {

        console.log(error.response?.data || error)
        throw error

    }
}