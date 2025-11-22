import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";

import { getDetallesConductorService } from "../../../global/api/admin/DriversManagementService";

import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";
import Badge from "../../ui/badge/Badge";


export const MostrarDetallesConductor = ({ driverId, onClose }) => {

    const [detallesConductor, setDetallesConductor] = useState(null)
    const [loading, setLoading] = useState(true)


    const verDetalles = async (id_conductor) => {

        try {

            const conductor = await getDetallesConductorService(id_conductor)
            setDetallesConductor(conductor)

        } catch (error) {
            toast.error("No se pudierón cargar los detalles del conductor")

        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (driverId) {
            verDetalles(driverId)
        }
    }, [driverId])


    // Para obtener el color según el estado
    function BadgeColor(estado) {
        const colorMap = {
            "Disponible": "success",
            "en_ruta": "warning",
            "no_disponible": "error",
        };

        return colorMap[estado] || "primary";
    }


    return (
        <>
            <Modal
                isOpen={true}
                onClose={onClose}
                showCloseButton
            >
                {loading ? (
                    <div className="w-full flex justify-center py-10">
                        <Loading />
                    </div>
                ) : <>
                    <div className="p-6 max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Detalles del Conductor
                            </h3>
                            <Badge color={BadgeColor(detallesConductor.estado)}>{detallesConductor.estado}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                                <div className="flex items-center justify-between w-full mb-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                                        <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                        Información del conductor
                                    </h4>

                                    <h4 className="text-gray-700 dark:text-white">
                                        <Badge color={detallesConductor.conductor_detalle.estado === "activo" ? "success" : "error"}>{detallesConductor.conductor_detalle.estado}</Badge>
                                    </h4>
                                </div>


                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                            {detallesConductor.conductor_detalle.nombre} {detallesConductor.conductor_detalle.apellido}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Empresa</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                            {detallesConductor.conductor_detalle.empresa_nombre}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Tipo de documento</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                            {detallesConductor.conductor_detalle.tipo_documento}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Numero de documento</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                            {detallesConductor.conductor_detalle.documento}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Correo</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                            {detallesConductor.conductor_detalle.correo}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Telefono</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                            {detallesConductor.conductor_detalle.telefono_movil}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}

            </Modal>
        </>
    )


}
