import { useState, useEffect } from "react";
import { BellDot } from 'lucide-react';

import ComponentCard from "../../common/ComponentCard";

import { GetNovedades } from "../../../global/api/NovedadesService";


export const HistorialNovedadesAdmin = () => {

    const [novedades, setNovedades] = useState([])


    const obtenerNovedades = async () => {

        const data = await GetNovedades()
        setNovedades(data)

    }

    useEffect(() => {
        obtenerNovedades()
    }, [])


    return (
        <>
            <ComponentCard title={
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <BellDot className="size-4" />
                    <p>Historial de novedades</p>
                </div>
            }>
                {novedades.length > 0 ? (
                    novedades.map((novedad) => {
                        const fechaBackend = novedad.fecha_novedad;
                        const fecha = new Date(fechaBackend)

                        const formatoFecha = new Intl.DateTimeFormat("es-CO", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                        }).format(fecha)

                        return (
                            <p key={novedad.id_novedad}>
                                <strong>ID:</strong> {novedad.id_novedad} <br />
                                <strong>Conductor:</strong> {novedad.conductor_nombre} <br />
                                <strong>Tipo:</strong> {novedad.tipo} <br />
                                <strong>Descripcion:</strong> {novedad.descripcion} <br />
                                <img src={novedad.imagen} alt="No adjuntó comprobante" /> <br />
                                <strong>Fecha:</strong> {formatoFecha} <br />
                                <strong>{novedad.leida ? "Leida" : "No Leida"} </strong>  <br /> <br /> <br /> <br />
                            </p>
                        );
                    })
                ) : (
                    <p>No hay novedades</p>

                )}
            </ComponentCard>
        </>
    )
}