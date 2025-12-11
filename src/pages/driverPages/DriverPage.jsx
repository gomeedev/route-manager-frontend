import { useState, useEffect } from "react";

import { getConductorByUserId } from "../../global/api/drivers/rutaActual";
import { DriverMapa } from "../../components/drivers/mapa/DriverMapa";

import Loading from "../../components/common/Loading";


export const DriverPage = () => {

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
                <div className="w-full flex justify-center py-10">
                    <Loading />
                </div>

            )}
        </>
    );

}