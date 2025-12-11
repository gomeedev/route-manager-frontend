import { useEffect, useState } from "react";

import { getHistorialRutasDriver } from "../../../global/api/drivers/historialRutas";
import { getConductorByUserId } from "../../../global/api/drivers/rutaActual";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";

import Table from "../../ui/table/Table";
import Badge from "../../ui/badge/Badge";
import Loading from "../../common/Loading";




export const HistorialRutasDriver = () => {

    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarHistorial = async () => {

        try {

            setLoading(true);

            const user = JSON.parse(localStorage.getItem("user"));
            const conductor = await getConductorByUserId(user.id_usuario);
            const rutas = await getHistorialRutasDriver(conductor.id_conductor);

            setHistorial(rutas);

        } catch (error) {

            console.error("Error al cargar historial:", error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        cargarHistorial();
    }, []);


    const columns = [
        {
            key: "codigo_manifiesto",
            label: "Manifiesto",
        },
        {
            key: "vehiculo",
            label: "Vehiculo",
            render: (item) => {
                const vehiculo = item.vehiculo_usado_detalle || item.conductor_detalle?.vehiculo_detalle;

                return (
                    <div className="flex items-center gap-3">
                        {vehiculo ? (
                            <>
                                <img
                                    src={vehiculo.imagen || fotoDefaultUrl}
                                    alt="vehiculo"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {vehiculo.tipo}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {vehiculo.placa}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                <i>Sin asignar</i>
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            key: "paquetes_entregados",
            label: "Paquetes entregados",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <Badge color="info">{item.paquetes_entregados}</Badge>
                </div>
            )
        },
        {
            key: "paquetes_fallidos",
            label: "Paquetes fallidos",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <Badge color="error">{item.paquetes_fallidos}</Badge>
                </div>
            )
        },
        {
            key: "fecha_inicio",
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
            key: "fecha_fin",
            label: "Fecha fin",
            render: (item) => {
                if (!item.fecha_fin) {
                    return (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            <i>Pendiente</i>
                        </span>
                    );
                }

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
                );
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

    if (loading) return <Loading />;

    if (historial.length === 0) {
        return <div>No tienes rutas completadas aún</div>;
    }

    return (
        <>
            {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                    <Loading />
                </div>
            ) :
                <>
                    <div className="mt-4 mb-8">
                        <AnimatedTitle text="Historial de mis rutas" />
                        <AnimatedText text="En este espacio encontrarás la información de todas las rutas realizadas por ti" />
                    </div>

                    <Table
                        title={
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <p>Total de rutas hechas: <i><span className="text-gray-800 dark:text-white">{historial.length}</span></i></p>
                            </div>
                        }
                        columns={columns}
                        data={historial}
                    />

                </>
            }
        </>

    );
};