import { useState, useEffect } from "react";
import { toast } from "sonner";

import { ArrowRight, Edit, Trash2, Eye } from "lucide-react";

import { GetPackagesManagementService } from "../../../global/api/admin/PackagesManagementService";
import { CrearPaquetes } from "./CrearPaquete";
import { EditarPaquete } from "./EditarPaquete";
import { MostrarDetallesPaquete } from "./MostrarDetallesPaquete";
import { EliminarPaquete } from "./EliminarPaquete";
import { AsignarPaquete } from "./AsignarPaquete";
import { ReasignarPaquete } from "./ReasignarPaquete";

import Table from "../../ui/table/Table";
import EstadoFilter from "../../../hooks/EstadoFilter";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";




export const PaquetesManagement = () => {

    const [paquetes, setPaquetes] = useState([])
    const [selectedIdPaquetes, setSelectedIdPaquetes] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filtroEstado, setFiltroEstado] = useState("");


    const ESTADOS_PAQUETE = ["Pendiente", "Asignado", "En ruta", "Entregado", "Fallido"];

    const paquetesFiltrados = filtroEstado === ""
        ? paquetes
        : paquetes.filter(p => p.estado_paquete === filtroEstado);


    const getPaquetes = async () => {

        setLoading(true)

        try {

            const response = await GetPackagesManagementService();

            const orderMap = {
                "Pendiente": 1,
                "Asignado": 2,
                "En ruta": 3,
                "Entregado": 4,
                "Fallido": 5

            }


            const sorted = response.sort(
                (a, b) => orderMap[a.estado_paquete] - orderMap[b.estado_paquete]
            )

            setPaquetes(sorted)

        } catch (error) {

            toast.error(error.response?.data || "No se pudieron cargar los vehiculos")

        } finally {
            setLoading(false)
        }


    }

    useEffect(() => {
        getPaquetes();
    }, [])


    const columns = [
        {
            key: "id_paquete",
            label: "Id"
        },
        {
            key: "ruta_Asignada",
            label: "Ruta Asignada",
            render: (item) => {
                return (
                    <span className="text-sm text-gray-500 dark:text-gray-400"><i>{item.paquete_asignado}</i></span>
                )
            }
        },
        {
            key: "fecha_registro",
            label: "Registro",
            render: (item) => {
                const fecha = new Date(item.fecha_registro);
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
            key: "fecha_entrega",
            label: "Entrega",
            render: (item) => {
                const fecha = item?.ultimo_intento_entrega?.fecha;

                if (!fecha) {
                    return (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            <i>Pendiente</i>
                        </span>
                    );
                }

                const fechaFormateada = new Date(fecha);

                return (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {
                            new Intl.DateTimeFormat("es-CO", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour: "numeric",
                                minute: "numeric"
                            }).format(fechaFormateada)
                        }
                    </span>
                );
            }
        },
        {
            key: "cliente_detalle",
            label: "Cliente",
            render: (item) => (
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.cliente_detalle.nombre} {item.cliente_detalle.apellido}</span>
            )
        },
        {
            key: "destinatario",
            label: "Destinatario",
            render: (item) => (
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.destinatario_nombre} {item.destinatario_apellido}</span>
            )
        },
        {
            key: "estado",
            label: "Estado",
            render: (item) => {
                const colorMap = {
                    "Pendiente": "warning",
                    "Asignado": "primary",
                    "En ruta": "info",
                    "Entregado": "success",
                    "Fallido": "error",
                };

                return (
                    <Badge color={colorMap[item.estado_paquete] || "primary"}>
                        {item.estado_paquete}
                    </Badge>
                );
            }
        },
    ]

    const actions = [
        {
            key: "ver_detalles",
            label: "Ver detalles",
            icon: <Eye className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdPaquetes(item.id_paquete);
                setIsModalOpen("detalles");
            },
        },

        {
            key: "EditarPaquete",
            label: "Editar paquete",
            icon: <Edit className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdPaquetes(item.id_paquete)
                setIsModalOpen("Editar")
            },
            disabled: (item) => item.estado_paquete !== "Pendiente",
            className: "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        },
        {
            key: "EliminarPaquete",
            label: "Eliminar paquete",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdPaquetes(item.id_paquete)
                setIsModalOpen("Eliminar")
            },
            disabled: (item) => item.estado_paquete !== "Pendiente",
            className: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10",
        },
        {
            key: "asignar",
            label: "Asignar un paquete",
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdPaquetes(item.id_paquete)
                setIsModalOpen("asignar_paquete")
            },
            disabled: (item) => item.estado_paquete !== "Pendiente",
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500",
        },
        {
            key: "reasignar",
            label: "Reasignar paquete",
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdPaquetes(item.id_paquete);
                setIsModalOpen("reasignar_paquete");
            },
            disabled: (item) => item.estado_paquete !== "Fallido",
            className: "hover:bg-warning-50 text-warning-600 hover:dark:bg-warning-500/15 dark:text-warning-500",
        },
    ]


    return (
        <>

            {loading ? (
                <div className="w-full h-screen flex items-center justify-center" >
                    <Loading />
                </div >
            ) : <>
                <div className="mt-4 mb-12">
                    <AnimatedTitle text="Gestión de paquetes" />
                    <AnimatedText text="Gestiona el estado operativo de tus paquetes en tiempo real" />
                </div>

                <Table
                    title={`Total de paquetes: ${paquetesFiltrados.length}`}
                    columns={columns}
                    data={paquetesFiltrados}
                    actions={actions}
                    onAdd={() => { setIsModalOpen(true) }}
                    headerActions={
                        <EstadoFilter
                            value={filtroEstado}
                            onChange={setFiltroEstado}
                            estados={ESTADOS_PAQUETE}
                            entityLabel="paquetes"
                            showLabel={true}
                        />
                    }
                />



                {isModalOpen === true && (
                    <CrearPaquetes
                        onClose={() => setIsModalOpen(false)}
                        refreshTable={getPaquetes}
                    />
                )}

            </>}


            {isModalOpen === "detalles" && (
                <MostrarDetallesPaquete
                    paqueteId={selectedIdPaquetes}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={getPaquetes}
                />
            )}

            {isModalOpen === "Editar" && (
                <EditarPaquete
                    paqueteId={selectedIdPaquetes}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={getPaquetes}
                />
            )}


            {isModalOpen === "Eliminar" && (
                <EliminarPaquete
                    paqueteId={selectedIdPaquetes}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={getPaquetes}
                />
            )}

            {isModalOpen === "asignar_paquete" && (
                <AsignarPaquete
                    paqueteId={selectedIdPaquetes}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={getPaquetes}
                />
            )}

            {isModalOpen === "reasignar_paquete" && (
                <ReasignarPaquete
                    paqueteId={selectedIdPaquetes}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={getPaquetes}
                />
            )}
        </>
    )

}