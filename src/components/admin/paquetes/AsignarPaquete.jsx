import { useState, useEffect } from "react";
import { toast } from "sonner";

import { ArrowRight } from "lucide-react";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import { GetRoutesManagementService, AsignarPaqueteService } from "../../../global/api/admin/RoutesManagementService";

import Table from "../../ui/table/Table";
import { Modal } from "../../ui/modal/Modal";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";




export const AsignarPaquete = ({ paqueteId, onClose, refreshTable }) => {

    const [rutas, setRutas] = useState([]);
    const [loading, setLoading] = useState(false);


    const obtenerRutas = async () => {

        setLoading(true)

        try {

            const rutasData = await GetRoutesManagementService();

            // Filtrar conductores disponibles
            const disponibles = rutasData.filter(
                (ruta) =>
                    (ruta.estado === "Pendiente")
            );

            setRutas(disponibles);

        } catch (error) {
            toast.error("No se pudieron cargar los rutas disponibles");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerRutas();
    }, []);


    const asignar = async (id_ruta) => {
        try {

            await AsignarPaqueteService(id_ruta, [paqueteId])
            toast.success("Paquete asignado correctamente");

            refreshTable();
            onClose();

        } catch (error) {
            toast.error(error.response?.data?.error || "Error al asignar paquete");
        }
    };


    const columns = [
        {
            key: "codigo_manifiesto",
            label: "Manifiesto"
        },
        {
            key: "total_paquetes",
            label: "Paquetes"
        },
        {
            key: "vehiculo_detalle.ruta_asignada",
            label: "Vehiculo"
        },
        {
            key: "estado",
            label: "Estado"
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
            <Modal isOpen={true} onClose={onClose} showCloseButton className="p-8" >
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-6 mt-4">
                    Asignar el paquete a una ruta
                </h4>

                {loading ? (
                    <div className="w-full flex justify-center py-10">
                        <Loading />
                    </div>
                ) : (
                    <Table
                        title={`Total de conductores: ${rutas.length}`}
                        columns={columns}
                        data={rutas}
                        actions={actions}
                    />
                )}
            </Modal>
        </>
    )

}