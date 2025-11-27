import { API_URL } from "../config/api";
import { getToken } from "../config/auth";

import axios from "axios";


// Ver novedades para las notificaciones del admin
export const GetNotifications = async () => {

    const token = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/novedades/`, {
            headers: { Authorization: `Bearer ${token}` }, 
            params: { 
                _limit: 12, 
                leida: false 
            },
        })
        
        return response.data

    } catch (error) {

        console.log(error.response?.data || error)
        throw error
    }
}


// Ver novedades segun rol del usuario
export const GetNovedades = async () => {

    const token = getToken();

    try {
        const response = await axios.get(`${API_URL}/api/v1/novedades/`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data

    } catch (error) {

        console.log(error.response?.data || error)
        throw error
    }
}


// Crear novedades para el driver
export const PostNovedades = async (formData) => {

    const token = getToken();

    try {

        const response = await axios.post(`${API_URL}/api/v1/novedades/`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data

    } catch (error) {
        
        console.log(error.response?.data || error)
        throw error
    }
}


// Marcar novedad como leida
export const MarcarNovedad = async (id_novedad, estado) => {

    const token = getToken();

    try {
        const response = await axios.patch(`${API_URL}/api/v1/novedades/${id_novedad}/`, estado, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data

    } catch(error) {
        console.log(error.response?.data || error)
        throw error
    }
}


// Eliminar novedades para el admin
export const DeleteNovedad = async (id_novedad) => {

    const token = getToken()

    try {
        const response = await axios.delete(`${API_URL}/api/v1/novedades/${id_novedad}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        return response.data
    } catch(error) {
        console.log(error.response?.data || error)
        throw error
    }
}