import { useState, useEffect } from "react";
import { toast } from "sonner";

import { ArrowRight } from "lucide-react";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import { GetRoutesManagementService, AsignarConductorService } from "../../../global/api/admin/RoutesManagementService";

import Table from "../../ui/table/Table";
import { Modal } from "../../ui/modal/Modal";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";





export const AsignarConductor = ({ driverId, onClose, refreshTable }) => {

    const [rutas, setRutas] = useState([]);
    const [loading, setLoading] = useState(false);


    const obtenerRutas = async () => {

        setLoading(true)

        try {

            const rutasData = await GetRoutesManagementService();

            // Filtrar rutas sin conductor
            const disponibles = rutasData.filter(
                (ruta) =>
                    (ruta.estado === "Pendiente")
            );

            setRutas(disponibles);

        } catch (error) {
            toast.error("No se pudieron cargar las rutas disponibles");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerRutas();
    }, []);


    const asignar = async (id_ruta) => {
        try {

            await AsignarConductorService(id_ruta, driverId)
            toast.success("Conductor asignado correctamente");

            refreshTable();
            onClose();

        } catch (error) {
            toast.error(error.response?.data?.error || "Error al asignar conductor");
        }
    };


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
                        <img src={conductor?.foto_perfil || fotoDefaultUrl}
                            alt="Conductor"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 gap-4">
                            {conductor
                                ? `${conductor.nombre} ${conductor.apellido}`
                                : <span className="text-sm text-gray-500 dark:text-gray-400"><i>Sin asignar</i></span>}
                        </span>
                    </div>
                );
            }
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
    ];


    const actions = [
        {
            key: "ruta_asignada",
            label: "Asignar conductor",
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: (item) => asignar(item.id_ruta),
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500"
        },
    ];

    return (
        <>
            <Modal isOpen={true} onClose={onClose} showCloseButton className="p-8">

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-6 mt-4">
                    Asignar el conductor a una ruta
                </h3>


                {loading ? (
                    <div className="w-full flex justify-center py-10">
                        <Loading />
                    </div>
                ) : (
                    <Table
                        title={`Total de rutas: ${rutas.length}`}
                        columns={columns}
                        data={rutas}
                        actions={actions}
                    />
                )}
            </Modal>
        </>
    );
};
