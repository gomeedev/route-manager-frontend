import { useState, useEffect } from "react";
import { toast } from "sonner";

import { ArrowRight } from "lucide-react";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import { DriversManagementService, AsignarVehiculoService } from "../../../global/api/admin/DriversManagementService";


import Table from "../../ui/table/Table";
import { Modal } from "../../ui/modal/Modal";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";




export const AsignarVehiculo = ({ vehicleId, onClose, refreshTable }) => {

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);


    const obtenerVehiculos = async () => {

        setLoading(true)

        try {

            const driversData = await DriversManagementService();

            // Filtrar conductores disponibles
            const disponibles = driversData.filter(
                (conductor) =>
                    (conductor.estado === "Disponible") && !conductor.vehiculo_detalle
            );

            setDrivers(disponibles);

        } catch (error) {
            toast.error("No se pudieron cargar los conductores disponibles");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerVehiculos();
    }, []);


    const asignar = async (id_conductor) => {
        try {

            await AsignarVehiculoService(id_conductor, vehicleId)
            toast.success("Vehiculo asignado correctamente");

            refreshTable();
            onClose();

        } catch (error) {
            toast.error(error.response?.data?.error || "Error al asignar conductor");
        }
    };


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
        {
            key: "conductor_detalle.tipo_documento",
            label: "Tipo documento",
        },
        {
            key: "conductor_detalle.correo",
            label: "Correo"
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
    ];


    const actions = [
        {
            key: "conductor_asignado",
            label: "Asignar conductor",
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: (item) => asignar(item.id_conductor),
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500"
        },
    ];

    return (
        <>
            <Modal isOpen={true} onClose={onClose} showCloseButton className="p-4" >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-6">
                    Asignar el vehiculo a un conductor
                </h3>

                {loading ? (
                    <div className="w-full flex justify-center py-10">
                        <Loading />
                    </div>
                ) : (
                    <Table
                        title={`Total de conductores: ${drivers.length}`}
                        columns={columns}
                        data={drivers}
                        actions={actions}
                    />
                )}
            </Modal>
        </>
    )

}