import { supabase } from "../supabase/supabaseClient";
import { API_URL } from "../config/api";
import axios from "axios";


export const SigninUserSupabase = async (email, password) => {

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw error;

    return data;
}


export const SigninUserDjango = async (token) => {

    const response = await axios.get(`${API_URL}/api/v1/usuario/me`, {
        headers: { "Authorization": `Bearer ${token}` }
    })

    return response.data
}


// Editar info de usuarios
export const EditProfileUser = async (UserId, UserData) => {
    try {
        const response = await axios.patch(`${API_URL}/api/v1/usuario/${UserId}/`, UserData,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}