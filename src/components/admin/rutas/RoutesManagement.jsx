import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Trash2, Eye, ArrowRight, Package, UserPlus } from "lucide-react";

import { GetRoutesManagementService } from "../../../global/api/admin/RoutesManagementService";
import { CrearRuta } from "./CrearRuta";
import { EliminarRuta } from "./EliminarRuta";
import { MostrarDetallesRuta } from "./MostrarDetallesRuta";
import { AsignarRutaConductor } from "./AsignarRutaConductor";
import { AsignarRutaPaquete } from "./AsignarRutaPaquetes";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import Table from "../../ui/table/Table";
import EstadoFilter from "../../../hooks/EstadoFilter";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";




export const RoutesManagement = () => {

    const [routes, setRoutes] = useState([])
    const [selectedIdRoutes, setSelectedIdRoutes] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filtroEstado, setFiltroEstado] = useState("");


    const ESTADOS_ROUTES = ["Pendiente", "Asignada", "En ruta", "Entregada", "Fallida"];

    const routesFiltradas = filtroEstado === ""
        ? routes
        : routes.filter(r => r.estado === filtroEstado);


    const GetRoutes = async () => {

        setLoading(true)

        try {

            const response = await GetRoutesManagementService();

            const orderMap = {
                "Pendiente": 1,
                "Asignada": 2,
                "En ruta": 3,
                "Completada": 4,
                "Fallida": 5

            }

            const sorted = response.sort((a, b) => {
                const estadoComparison = orderMap[a.estado] - orderMap[b.estado];

                // Si los estados son distintos, priorizar el estado
                if (estadoComparison !== 0) {
                    return estadoComparison;
                }

                // Si tienen el mismo estado, ordenar por cantidad de paquetes (desc)
                return (b.total_paquetes || 0) - (a.total_paquetes || 0);
            });


            setRoutes(sorted);

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
            key: "conductor",
            label: "Conductor",
            render: (item) => {
                const conductor = item.conductor_detalle?.conductor_detalle;

                return (
                    <div className="flex items-center gap-3">
                        <img
                            src={conductor?.foto_perfil || fotoDefaultUrl}
                            alt="Conductor"
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <span className="text-sm text-gray-600 dark:text-gray-400 gap-4">
                            {conductor
                                ? `${conductor.nombre} ${conductor.apellido}`
                                : <span className="text-sm text-gray-500 dark:text-gray-400"><i>Sin asignar</i></span>
                            }
                        </span>
                    </div>
                );
            }

        },
        {
            key: "vehiculo",
            label: "Vehiculo",
            render: (item) => {
                const vehiculo = item.conductor_detalle?.vehiculo_detalle;

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
            key: "paquetes",
            label: "Paquetes",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 gap-4">
                        <Badge color="info">{item.total_paquetes}</Badge>
                    </span>
                </div>
            )
        },
        {
            key: "fecha_inicio",
            label: "Fecha inicio",
            render: (item) => {
                if (!item.fecha_inicio) {
                    return (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            <i>Pendiente</i>
                        </span>
                    )
                }
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
        },

    ]


    const actions = [
        {
            key: "ver_detalles",
            label: "Ver detalles",
            icon: <Eye className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdRoutes(item.id_ruta);
                setIsModalOpen("detalles");
            },
        },
        {
            key: "EliminarRuta",
            label: "Eliminar ruta",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdRoutes(item.id_ruta)
                setIsModalOpen("Eliminar")
            },
            disabled: (item) => item.estado !== "Pendiente",
            className: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10",
        },
        {
            key: "asignar_paquete",
            label: "Asignar paquetes",
            icon: <Package className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdRoutes(item.id_ruta);
                setIsModalOpen("asignar_paquetes");
            },
            disabled: (item) => item.estado !== "Pendiente",
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500"
        },
        {
            key: "asignar_conductor",
            label: "Asignar conductor",
            icon: <UserPlus className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdRoutes(item.id_ruta);
                setIsModalOpen("asignar_conductor");
            },
            disabled: (item) => item.estado !== "Pendiente",
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500"
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
                        title={`Total de rutas: ${routesFiltradas.length}`}
                        columns={columns}
                        data={routesFiltradas}
                        actions={actions}
                        onAdd={() => { setIsModalOpen(true) }}
                        headerActions={
                            <EstadoFilter
                                value={filtroEstado}
                                onChange={setFiltroEstado}
                                estados={ESTADOS_ROUTES}
                                entityLabel="rutas"
                                showLabel={true}
                            />
                        }
                    />

                    {isModalOpen === true && (
                        <CrearRuta
                            onClose={() => setIsModalOpen(false)}
                            refreshTable={GetRoutes}
                        />
                    )}
                </>
            }

            {isModalOpen === "detalles" && (
                <MostrarDetallesRuta

                    routeId={selectedIdRoutes}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            {isModalOpen === "Eliminar" && (
                <EliminarRuta
                    routeId={selectedIdRoutes}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={GetRoutes}
                />
            )}
            {isModalOpen === "asignar_conductor" && (
                <AsignarRutaConductor
                    routeId={selectedIdRoutes}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={GetRoutes}
                />
            )}
            {isModalOpen === "asignar_paquetes" && (
                <AsignarRutaPaquete
                    routeId={selectedIdRoutes}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={GetRoutes}
                />
            )}
        </>
    )

}