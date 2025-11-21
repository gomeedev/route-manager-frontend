import { useState, useEffect } from "react";
import { toast } from "sonner";

import { GetRoutesManagementService } from "../../../global/api/admin/RoutesManagementService";

import Table from "../../ui/table/Table";
import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";




export const RoutesManagement = () => {

    const [routes, setRoutes] = useState([])
    const [loading, setLoading] = useState(false)


    const GetRoutes = async () => {

        setLoading(true)

        try {

            const response = await GetRoutesManagementService();
            setRoutes(response);

        } catch (error) {

            toast.error("No se puedieron cargar las rutas")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetRoutes()
    }, [])


    const columns = [
        {
            key: "codigo_manifiesto",
            label: "Manifiesto"
        },
        {
            label: "Conductor",
            render: (item) => {
                const conductor = item.conductor_detalle?.conductor_detalle;

                return (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400 gap-4">
                            {conductor
                                ? `${conductor.nombre} ${conductor.apellido}`
                                : <span className="text-gray-500 dark:text-gray-400"><i>Sin asignar</i></span>}
                        </span>
                    </div>
                );
            }
        },
        {
            label: "Vehiculo",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 gap-4">
                        {item.vehiculo_detalle
                            ? `${item.vehiculo_detalle.tipo} - ${item.vehiculo_detalle.placa}`
                            : <span className="text-gray-500 dark:text-gray-400"><i>Sin asignar</i></span>}
                    </span>
                </div>
            )
        },
        {
            label: "Paquetes",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 gap-4">
                        {item.paquetes_asignados.length}
                    </span>
                </div>
            )
        },
        {
            label: "Fecha inicio",
            render: (item) => {
                const fecha = new Date(item.fecha_inicio);
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
            label: "Fecha fin",
            render: (item) => {
                const fecha = new Date(item.fecha_fin);
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
            key: "estado",
            label: "Estado",
            render: (item) => {
                const colorMap = {
                    "Pendiente": "warning",
                    "Asignada": "primary",
                    "En ruta": "info",
                    "Completada": "success",
                    "Fallida": "error",
                };
                return <Badge color={colorMap[item.estado] || "primary"}>{item.estado}</Badge>
            }
        }

    ]


    return (
        <>
            {loading ? (
                <div className="w-full h-screen flex items-center justify-center" >
                    <Loading />
                </div >
            ) :
                <>
                    <div className="mt-4 mb-8">
                        <AnimatedTitle text="Gestión de rutas" />
                        <AnimatedText text="Gestiona el estado operativo de las rutas de tu empresa en tiempo real" />
                    </div>

                    <Table
                        title={`Total de rutas: ${routes.length}`}
                        columns={columns}
                        data={routes}
                    />
                </>
            }
        </>
    )

}