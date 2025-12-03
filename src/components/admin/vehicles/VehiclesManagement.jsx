import { useState, useEffect } from "react";
import { toast } from "sonner";

import { ArrowRight, Edit, Trash2 } from "lucide-react";

import { GetVehiclesManagement } from "../../../global/api/admin/VehiclesManagementService";
import { CrearVehiculos } from "./CrearVehiculos";
import { EditarVehiculo } from "./EditarVehiculos";
import { EliminarVehiculo } from "./EliminarVehiculos";
import { AsignarVehiculo } from "./AsignarVechiculo";

import Table from "../../ui/table/Table";
import EstadoFilter from "../../../hooks/EstadoFilter";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";




export const VehiclesManagement = () => {

    const [vehicles, setVehicles] = useState([])
    const [selectedIdVehicle, setSelectedIdVehicle] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filtroEstado, setFiltroEstado] = useState("");

    
    const ESTADOS_VEHICLES = ["Disponible", "Asignado", "En ruta", "No Disponible"];

    const vehiclesFiltrados = filtroEstado === ""
        ? vehicles
        : vehicles.filter(v => v.estado === filtroEstado);


    const getVehicles = async () => {

        setLoading(true)

        try {

            const response = await GetVehiclesManagement();

            const orderMap = {
                "Disponible": 1,
                "Asignado": 2,
                "En ruta": 3,
                "No disponible": 4

            }


            const sorted = response.sort(
                (a, b) => orderMap[a.estado] - orderMap[b.estado]
            )

            setVehicles(sorted)

        } catch (error) {

            toast.error(error.response?.data || "No se pudieron cargar los vehiculos")

        } finally {
            setLoading(false)
        }


    }

    useEffect(() => {
        getVehicles();
    }, [])


    const columns = [
        {
            key: "id_vehiculo",
            label: "Id"
        },
        {
            key: "imagen",
            label: "Vehiculo",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <img
                        src={item.imagen || "Sin foto"}
                        alt="Vehiculo"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
            )
        },
        {
            key: "conductor_asignado",
            label: "Conductor Asignado",
            render: (item) => {
                return (
                    <span className="text-sm text-gray-500 dark:text-gray-400"><i>{item.conductor_asignado}</i></span>
                )
            }
        },
        {
            key: "tipo",
            label: "Tipo"
        },
        {
            key: "placa",
            label: "Placa"
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
                    <Badge color={colorMap[item.estado] || "primary"}>{item.estado}</Badge>
                );
            }
        },
    ]


    const actions = [
        {
            key: "EditarVehiculo",
            label: "Editar Vehiculo",
            icon: <Edit className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdVehicle(item.id_vehiculo)
                setIsModalOpen("Editar")
            },
            disabled: (item) => item.estado !== "Disponible",
            className: "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        },
        {
            key: "EliminarVehiculo",
            label: "Eliminar vehiculo",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdVehicle(item.id_vehiculo)
                setIsModalOpen("Eliminar")
            },

            className: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10",
        },
        {
            key: "asignar",
            label: "Asignar un conductor",
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdVehicle(item.id_vehiculo)
                setIsModalOpen("asignar_vehiculo")
            },
            disabled: (item) => item.estado !== "Disponible",
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500",
        },


    ]


    return (
        <>

            {loading ? (
                <div className="w-full h-screen flex items-center justify-center" >
                    <Loading />
                </div >
            ) : <>
                <div className="mt-4 mb-8">
                    <AnimatedTitle text="Gestión de vehiculos" />
                    <AnimatedText text="Gestiona el estado operativo de tus vehiculos en tiempo real" />
                </div>

                <Table
                    title={`Total de vehiculos: ${vehiclesFiltrados.length}`}
                    columns={columns}
                    data={vehiclesFiltrados}
                    actions={actions}
                    onAdd={() => setIsModalOpen(true)}
                    headerActions={
                        <EstadoFilter
                            value={filtroEstado}
                            onChange={setFiltroEstado}
                            estados={ESTADOS_VEHICLES}
                            entityLabel="Vehiculos"
                            showLabel={true}
                        />
                    }
                />


                {isModalOpen === true && (
                    <CrearVehiculos
                        onClose={() => setIsModalOpen(false)}
                        refreshTable={getVehicles}
                    />
                )}

            </>}


            {isModalOpen === "Editar" && (
                <EditarVehiculo
                    vehicleId={selectedIdVehicle}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={getVehicles}
                />
            )}

            {isModalOpen === "Eliminar" && (
                <EliminarVehiculo
                    vehicleId={selectedIdVehicle}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={getVehicles}
                />
            )}

            {isModalOpen === "asignar_vehiculo" && (
                <AsignarVehiculo
                    vehicleId={selectedIdVehicle}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={getVehicles}
                />
            )}
        </>
    )

}