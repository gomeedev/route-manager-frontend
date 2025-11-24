import { useState, useEffect } from "react";
import { toast } from "sonner";

import { ArrowRight } from "lucide-react";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import { AsignarConductorService } from "../../../global/api/admin/RoutesManagementService";
import { DriversManagementService } from "../../../global/api/admin/DriversManagementService";

import Table from "../../ui/table/Table";
import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";
import Badge from "../../ui/badge/Badge";




export const AsignarRutaConductor = ({ routeId, onClose, refreshTable }) => {

    const [conductor, setConductor] = useState([]);
    const [loading, setLoading] = useState(false);


    const obtenerConductores = async () => {

        setLoading(true)

        try {

            const driversData = await DriversManagementService();

            // Filtrar rutas sin conductor
            const disponibles = driversData.filter(
                (conductor) =>
                    (conductor.estado === "Disponible") && conductor.vehiculo_detalle
            );

            setConductor(disponibles);

        } catch (error) {

            toast.error("No se pudieron cargar las rutas disponibles");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerConductores();
    }, []);


    const asignar = async (id_conductor) => {

        try {

            await AsignarConductorService(routeId, id_conductor)
            toast.success("Ruta asignada correctamente");

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
            <Modal isOpen={true} onClose={onClose} showCloseButton className="p-4">

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-6">
                    Asignar el conductor a esta ruta
                </h3>


                {loading ? (
                    <div className="w-full flex justify-center py-10">
                        <Loading />
                    </div>
                ) : (
                    <Table
                        title={`Total de conductores: ${conductor.length}`}
                        columns={columns}
                        data={conductor}
                        actions={actions}
                    />
                )}
            </Modal>
        </>
    );
};
