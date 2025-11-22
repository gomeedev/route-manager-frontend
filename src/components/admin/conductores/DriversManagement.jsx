import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, Edit, ArrowRight } from "lucide-react";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import { DriversManagementService } from "../../../global/api/admin/DriversManagementService";
import { MostrarDetallesConductor } from "./MostrarDetallesConductor";
import { EditarConductor } from "./EditarConductor";
import { AsignarConductor } from "./AsignarConductor";

import Loading from "../../common/Loading";
import Table from "../../ui/table/Table";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";




export const DriversManagement = () => {

    const [drivers, setDrivers] = useState([])
    const [selectedIdConductor, setSelectedIdConductor] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)


    const GetConductores = async () => {

        setLoading(true)

        try {

            const response = await DriversManagementService();

            // Ordenar los conductores por estado
            const orderMap = {
                "Disponible": 1,
                "Asignado": 2,
                "En ruta": 3,
                "No disponible": 4

            }

            const sorted = response.sort(
                (a, b) => orderMap[a.estado] - orderMap[b.estado]
            )


            setDrivers(sorted);

        } catch (error) {

            toast.error("No se puedieron cargar los conductores")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetConductores();
    }, []);


    const columns = [
        {
            key: "id_conductor",
            label: "id"
        },
        {
            key: "conductor_detalle",
            label: "Conductor",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <img
                        src={item.conductor_detalle.foto_perfil || fotoDefaultUrl}
                        alt="Conductor"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.conductor_detalle.nombre} {item.conductor_detalle.apellido}
                    </span>
                </div>
            )
        },
/*         {
            key: "conductor_detalle.tipo_documento",
            label: "Tipo documento",
        }, */
        {
            key: "conductor_detalle.correo",
            label: "Correo"
        },
        {
            key: "conductor_detalle.telefono_movil",
            label: "telefono"
        },
        {
            key: "vehiculo_detalle",
            label: "Vehiculo asignado",
            render: (item) => {
                return (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        <i>{item.vehiculo_detalle?.placa ?? "Sin asignar"}</i>
                    </span>
                )
            },
        },
        {
            key: "ruta_asignada",
            label: "Ruta asignada",
            render: (item) => {
                return (
                    <span className="text-sm text-gray-500 dark:text-gray-400"><i>{item.ruta_asignada}</i></span>
                )
            }
        },
        {
            key: "estado",
            label: "Estado",
            render: (item) => {
                const colorMap = {
                    "Disponible": "success",
                    "Asignado": "primary",
                    "En ruta": "warning",
                    "No disponible": "error",
                };

                return (
                    <Badge color={colorMap[item.estado] || "primary"}>
                        {item.estado}
                    </Badge>
                );
            }

        }
    ]

    const actions = [
        {
            key: "ver_detalles",
            label: "Ver detalles",
            icon: <Eye className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdConductor(item.id_conductor);
                setIsModalOpen("detalles");
            },
        },
        {
            key: "editar",
            label: "Editar información",
            icon: <Edit className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdConductor(item.id_conductor);
                setIsModalOpen("editar");
            },
            className: "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        },
        {
            key: "asignar",
            label: "Asignar una ruta",
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdConductor(item.id_conductor);
                setIsModalOpen("asignar_conductor");
            },
            disabled: (item) => item.estado !== "Disponible",
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500"
        }

    ];



    return (
        <>

            {loading ? (
                <div className="w-full h-screen flex items-center justify-center" >
                    <Loading />
                </div >
            ) :
                <>
                    <div className="mt-4 mb-8">
                        <AnimatedTitle text="Gestión de condutores" />
                        <AnimatedText text="Gestiona el estado operativo de tus conductores en tiempo real" />
                    </div>

                    <Table
                        title={`Total de conductores: ${drivers.length}`}
                        columns={columns}
                        data={drivers}
                        actions={actions}
                    />
                </>
            }

            {isModalOpen === "detalles" && (
                <MostrarDetallesConductor
                    driverId={selectedIdConductor}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {isModalOpen === "editar" && (
                <EditarConductor
                    driverId={selectedIdConductor}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={GetConductores}
                />
            )}

            {isModalOpen === "asignar_conductor" && (
                <AsignarConductor
                    driverId={selectedIdConductor}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={GetConductores}
                />
            )}


        </>
    )
}
