import React from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";


export const AdminPage = () => {

    const navigate = useNavigate();

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) throw error;
        navigate("/signin");
    };


    return (
        <>
            <h1>Dashboard admin</h1>
            <button onClick={signOut}>Cerrar sesión</button>
        </>
    )
}