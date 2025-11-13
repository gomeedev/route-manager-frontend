import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BellDot } from 'lucide-react';

import { GetNovedades } from "../../../global/api/NovedadesService";
import { DeleteNovedad } from "../../../global/api/NovedadesService";

import ComponentCard from "../../common/ComponentCard";
import { Modal } from "../../ui/modal/Modal";


export const HistorialNovedadesAdmin = () => {

    const [novedades, setNovedades] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)


    const obtenerNovedades = async () => {
        try {

            const data = await GetNovedades()
            setNovedades(data)

        } catch (error) {

            toast.error("No se pudieron cargar las novedades")
        }

    }

    useEffect(() => {
        obtenerNovedades()
    }, [])


    const handleDelete = async (id_novedad) => {

        if (!window.confirm('¿Estás seguro de eliminar esta novedad?')) return

        setLoading(true)

        try {

            const deleteNovedad = await DeleteNovedad(id_novedad)
            toast.success("Novedad eliminada")

            setNovedades(novedades.filter(novedad => novedad.id_novedad !== id_novedad))

        } catch (error) {
            toast.error("No se pudo eliminar la novedad")
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            <ComponentCard title={
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <BellDot className="size-4" />
                    <p>Historial de novedades</p>
                </div>
            }>

                {loading && <p>Cargando...</p>}

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
                                <button onClick={() => handleDelete(novedad.id_novedad)}>Eliminar</button>
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