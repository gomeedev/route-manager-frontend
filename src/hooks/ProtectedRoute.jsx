import React, { useState, useEffect } from "react"
import { supabase } from "../supabase/supabaseClient";
import { Navigate } from "react-router-dom";


function ProtectedRoute({ children, role }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {

            const {
                data: { session },
            } = await supabase.auth.getSession();

            // !!null -> false
            // !!{} -> true
            // convierte el valor a un boolean
            setAuthenticated(!!session);
            setLoading(false);
        };

        getSession();
    }, []);


    if (loading) {
        return <div>Cargando...</div>
    }

    if (!authenticated) {
        return <Navigate to="/signin" />
    }


    const userRole = localStorage.getItem("rol");
    if (role && userRole !== role) {
        return <Navigate to="/signin" />
    }

    return children;
}

export default ProtectedRoute