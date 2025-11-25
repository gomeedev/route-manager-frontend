import React, { useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../global/supabase/supabaseClient";

import Loading from "../components/common/Loading";


function ProtectedRoute({ role }) {
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
        return (
            <div className="w-full flex justify-center py-10">
                <Loading />
            </div>
        )
    }

    if (!authenticated) {
        return <Navigate to="/signin" />
    }


    const userRole = localStorage.getItem("rol");
    if (role && userRole !== role) {
        return <Navigate to="/signin" />
    }

    return <Outlet />;
}

export default ProtectedRoute