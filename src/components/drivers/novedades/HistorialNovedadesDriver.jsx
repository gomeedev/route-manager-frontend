import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BellDot, Trash2, Edit, Eye } from 'lucide-react';

import { GetNovedades, DeleteNovedad } from "../../../global/api/NovedadesService";

import Table from "../../ui/table/Table";
import { Modal } from "../../ui/modal/Modal";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";

import Loading from "../../common/Loading";


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
            setLoading(false)

        } catch (error) {

            toast.error("No se pudieron cargar las novedades")
        }

    }

    useEffect(() => {
        obtenerNovedades()
    }, [])


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
                    "demoras_operativas": "primary"
                };
                return <Badge color={colorMap[item.tipo] || "primary"}>{item.tipo}</Badge>
            },
        },
        {
            key: 'descripcion',
            label: 'Descripción',
            cellClassName: 'max-w-xs',
            render: (item) => (
                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2" title={item.descripcion}>
                    {item.descripcion}
                </div>
            ),
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
        {
            key: "leida",
            label: "Estado",
            render: (item) => {
                return (
                    item.leida ? <Badge color="success">Leida</Badge> : <Badge color="error">No leida</Badge>
                )
            }
        }
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
                        <AnimatedTitle text="Historial de mis novedades" />
                        <AnimatedText text="En este espacio encontrarás todos los reportes que has hecho" />
                    </div>

                    <Table
                        title={
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <p>Total de novedades hechas: <i><span className="text-gray-800 dark:text-white">{novedades.length}</span></i></p>
                            </div>
                        }
                        data={novedades}
                        columns={columns}
                    />
                </>
            }

        </>
    )
}