import { useState, useEffect } from "react";
import { toast } from "sonner";

import { ArrowRight } from "lucide-react";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import { AsignarPaqueteService } from "../../../global/api/admin/RoutesManagementService";
import { GetPackagesManagementService } from "../../../global/api/admin/PackagesManagementService";

import Table from "../../ui/table/Table";
import { Modal } from "../../ui/modal/Modal";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";




export const AsignarRutaPaquete = ({ routeId, onClose, refreshTable }) => {

    const [paquetes, setPaquetes] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [loading, setLoading] = useState(false);


    const obtenerPaquetes = async () => {

        setLoading(true)

        try {

            const paquetesData = await GetPackagesManagementService();

            // Filtrar conductores disponibles
            const disponibles = paquetesData.filter(
                (paquete) =>
                    (paquete.estado_paquete === "Pendiente")
            );

            setPaquetes(disponibles);

        } catch (error) {
            toast.error("No se pudieron cargar los paquetes disponibles");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerPaquetes();
    }, []);


    const asignar = async (seleccionados) => {
        try {

            await AsignarPaqueteService(routeId, seleccionados)
            toast.success("Paquetes asignados correctamente");

            refreshTable();
            onClose();

        } catch (error) {
            toast.error(error.response?.data?.error || "Error al asignar paquetes");
        }
    };


    const columns = [
        {
            key: "select",
            label: "Seleccionar",
            render: (item) => (
                <input
                    type="checkbox"
                    checked={seleccionados.includes(item.id_paquete)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSeleccionados([...seleccionados, item.id_paquete]);
                        } else {
                            setSeleccionados(seleccionados.filter(id => id !== item.id_paquete));
                        }
                    }}
                />
            )
        },
        {
            key: "id_paquete",
            label: "ID"
        },
        {
            key: "fecha_registro",
            label: "Registro"
        },
        {
            key: "cliente_detalle",
            label: "Cliente",
            render: (item) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.cliente_detalle.nombre} {item.cliente_detalle.apellido}
                </span>
            )
        },
        {
            key: "destinatario_nombre",
            label: "Destinatario",
            render: (item) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.destinatario_nombre} {item.destinatario_apellido}
                </span>
            )
        },
        {
            key: "estado_paquete",
            label: "Estado",
            render: (item) => {
                const colorMap = {
                    "Pendiente": "success",
                    "Asignado": "primary",
                    "En ruta": "warning",
                    "No disponible": "error",
                };

                return (
                    <Badge color={colorMap[item.estado_paquete] || "primary"}>
                        {item.estado_paquete}
                    </Badge>
                );
            }


        }
    ];


    const actions = [
        {
            key: "ruta_asignada",
            label: "Asignar paquete",
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: (item) => asignar([item.id_paquete]),
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500"
        },
    ];


    return (
        <>
            <Modal isOpen={true} onClose={onClose} showCloseButton className="p-8" >
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-6 mt-4">
                    Asignar paquetes a la ruta
                </h4>

                {loading ? (
                    <div className="w-full flex justify-center py-10">
                        <Loading />
                    </div>
                ) : (
                    <Table
                        title={`Total de paquetes: ${paquetes.length}`}
                        columns={columns}
                        data={paquetes}
                        actions={actions}
                    />
                )}
                <button
                    onClick={() => asignar(seleccionados)}
                    className="w-full mt-10 px-4 py-3 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg"
                >
                    Asignar paquetes
                </button>

            </Modal>
        </>
    )

}