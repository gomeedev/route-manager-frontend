import { useState, useEffect } from "react";

import { getConductorByUserId } from "../../global/api/drivers/rutaActual";
import { DriverMapa } from "../../components/drivers/mapa/DriverMapa";

export const DriverPage = () => {
    // Ejemplo en DriverDashboard.jsx o donde estés
    const [driverId, setDriverId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        const loadDriver = async () => {
            const conductor = await getConductorByUserId(user.id_usuario);
            setDriverId(conductor.id_conductor);
        };

        loadDriver();
    }, []);

    

    return (
        <>
            {driverId ? (
                <DriverMapa driverId={driverId} />
            ) : (
                <p>Cargando información del conductor...</p>
            )}
        </>
    );

}