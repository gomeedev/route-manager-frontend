import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Edit } from "lucide-react";

import { GetVehiclesManagement } from "../../../global/api/admin/VehiclesManagementService";
import { CrearVehiculos } from "./CrearVehiculos";
import { EditarVehiculo } from "./EditarVehiculos";

import Table from "../../ui/table/Table";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";




export const VehiclesManagement = () => {

    const [vehicles, setVehicles] = useState([])
    const [selectedIdVehicle, setSelectedIdVehicle] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)


    const getVehicles = async () => {

        setLoading(true)

        try {

            const response = await GetVehiclesManagement();
            setVehicles(response)

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
                        alt="Conductor"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
            )
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
            key: "EditarVehiculos",
            label: "Editar Vehiculos",
            icon: <Edit className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdVehicle(item.id_vehiculo)
                setIsModalOpen("Editar")
            }
        }

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
                    title={`Total de vehiculos: ${vehicles.length}`}
                    columns={columns}
                    data={vehicles}
                    actions={actions}
                    onAdd={() => setIsModalOpen(true)}
                />


                {isModalOpen && (
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
        </>
    )

}