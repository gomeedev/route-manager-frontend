import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BellDot, Trash2, Edit, Eye } from 'lucide-react';

import { GetNovedades, DeleteNovedad } from "../../../global/api/NovedadesService";

import Loading from "../../common/Loading";
import Table from "../../ui/table/Table";
import { Modal } from "../../ui/modal/Modal";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";


export const HistorialNovedadesAdmin = () => {

    const [novedades, setNovedades] = useState([])
    const [selectedId, setSelectedId] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)


    const obtenerNovedades = async () => {

        setLoading(true)

        try {

            const data = await GetNovedades()
            setNovedades(data)

        } catch (error) {

            toast.error("No se pudieron cargar las novedades")

        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        obtenerNovedades()
    }, [])


    const handleDelete = async (id_novedad) => {

        setLoading(true)

        try {

            const deleteNovedad = await DeleteNovedad(id_novedad)
            toast.success("Novedad eliminada")

            setNovedades(novedades.filter(novedad => novedad.id_novedad !== id_novedad))
            setIsModalOpen(false)

        } catch (error) {

            toast.error("No se pudo eliminar la novedad")

        } finally {
            setLoading(false)
        }
    }


    const columns = [
        {
            key: "id_novedad",
            label: "id",
        },
        {
            key: "conductor_nombre",
            label: "Conductor",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <img
                        src={item.imagen || "https://via.placeholder.com/40"}
                        alt="Conductor"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.conductor_nombre}
                    </span>
                </div>
            )
        },
        {
            key: "tipo",
            label: "Tipo",
            render: (item) => {
                const colorMap = {
                    "problemas_entrega": "error",
                    "problemas_documentacion": "warning",
                    "demoras_operativas": "success"
                };
                return <Badge color={colorMap[item.tipo] || "primary"}>{item.tipo}</Badge>
            },
        },

        {
            key: "descripcion",
            label: "Descripción",
        },
        {
            key: "fecha_novedad",
            label: "Fecha",
            render: (item) => {
                const fecha = new Date(item.fecha_novedad);
                return (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {
                            new Intl.DateTimeFormat("es-CO", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour: "numeric",
                                minute: "numeric"
                            }).format(fecha)
                        }
                    </span>
                )
            }
        },
    ]


    const actions = [
        {
            key: 'delete',
            label: "Eliminar",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedId(item.id_novedad);
                setIsModalOpen(true);
            },
            className: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10",
        },
    ]


    return (


        <>

            {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                    <Loading />
                </div>
            ) :
                <>
                    <div className="mt-4 mb-8">
                        <AnimatedTitle text="Historial de notificaciones" />
                        <AnimatedText text="Resiva todo el historial de novedades reportadas por tus conductores" />
                    </div>

                    <Table
                        title={`Total de novedades: ${novedades.length}`
                        }
                        data={novedades}
                        columns={columns}
                        actions={actions}
                    />
                </>
            }

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                showCloseButton={true}
                size="sm"
            >
                <div className="flex flex-col items-center justify-center text-center space-y-6 p-6">
                    <p className="text-[16px] font-medium text-gray-800 dark:text-gray-200">
                        ¿Estás seguro que deseas eliminar esta novedad?
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="flex items-center justify-center gap-2 w-[150px] px-4 py-3 text-sm font-medium transition rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600/15 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={() => handleDelete(selectedId)}
                            className="flex items-center justify-center gap-2 w-[150px] px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-error-400 text-error-50  transition duration-200 hover:bg-error-500 dark:bg-error-500/15 dark:text-error-600 dark:transition duration-200   dark:hover:bg-error-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </Modal>

        </>
    )
}