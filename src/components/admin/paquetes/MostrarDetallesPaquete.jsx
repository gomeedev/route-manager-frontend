import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Edit, User, Ruler, Calendar } from "lucide-react";
import { Package } from "lucide-react";

import { GetDetallesPaquetesService } from "../../../global/api/admin/PackagesManagementService";
import { ClientsManagementService } from "../../../global/api/admin/ClientsManagementService";

import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";
import Badge from "../../ui/badge/Badge";




export const MostrarDetallesPaquete = ({ paqueteId, onClose }) => {
    const [detallesPaquete, setDetallesPaquete] = useState(null)
    const [detallesCliente, setDetallesCliente] = useState(null)
    const [loading, setLoading] = useState(true)


    const getClientes = async () => {
        const res = await ClientsManagementService();
        setDetallesCliente(res.map(c => ({
            value: c.id_cliente,
            label: `${c.nombre} ${c.apellido}`
        })));
    };


    const verDetalles = async (id_paquete) => {

        try {

            const paquete = await GetDetallesPaquetesService(id_paquete)
            setDetallesPaquete(paquete)

        } catch (error) {

            toast.error("No se pudierón cargar los detalles del conductor")

        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (paqueteId) {
            verDetalles(paqueteId)
        }
    }, [paqueteId])



    function BadgeColor(estado) {
        const colorMap = {
            "Pendiente": "warning",
            "Asignado": "primary",
            "En ruta": "info",
            "Entregado": "success",
            "Fallido": "error",
        };
        return colorMap[estado] || "primary";
    }


    // Antes del return
    let fechaRegistroFormateada = "No disponible";
    let fechaEntregaFormateada = "Pendiente";

    if (detallesPaquete) {
        const fechaRegistro = new Date(detallesPaquete.fecha_registro);
        fechaRegistroFormateada = new Intl.DateTimeFormat("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "numeric",
            minute: "numeric"
        }).format(fechaRegistro);

        if (detallesPaquete.fecha_entrega && detallesPaquete.fecha_entrega !== "pendiente") {
            const fechaEntrega = new Date(detallesPaquete.fecha_entrega);
            fechaEntregaFormateada = new Intl.DateTimeFormat("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric"
            }).format(fechaEntrega);
        }
    }





    return (
        <Modal isOpen={true} onClose={onClose} showCloseButton={true}>
            {loading ? (
                <div className="w-full flex justify-center py-10">
                    <Loading />
                </div>
            ) : <>
                <div className="p-6 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Detalles del Paquete
                        </h3>
                        <Badge color={BadgeColor(detallesPaquete.estado_paquete)}>{detallesPaquete.estado_paquete}</Badge>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                            Información del Cliente
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesPaquete.cliente_detalle.nombre} {detallesPaquete.cliente_detalle.apellido}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Télefono</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesPaquete.cliente_detalle.telefono_movil}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Correo electrónico</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesPaquete.cliente_detalle.correo}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Dirección cliente</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesPaquete.cliente_detalle.direccion}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                            Información del Destinatario
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesPaquete.destinatario_nombre} {detallesPaquete.cliente_detalle.destinatario_apellido}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Télefono</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesPaquete.destinatario_telefono}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Correo electrónico</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesPaquete.destinatario_correo}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Dirección de entrega</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    <Badge color="success">{detallesPaquete.direccion_entrega}</Badge>

                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                Información del Paquete
                            </h4>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">ID:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {detallesPaquete.id_paquete}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
                                    <Badge variant="light" size="sm">
                                        {detallesPaquete.tipo_paquete}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Cantidad:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {detallesPaquete.cantidad}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Valor:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${detallesPaquete.valor_declarado}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Ruta:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {detallesPaquete.paquete_asignado}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Localidad:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {detallesPaquete.localidad_detalle.nombre}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                <Ruler className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                Dimensiones
                            </h4>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Largo:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {detallesPaquete.largo} cm
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Ancho:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {detallesPaquete.ancho} cm
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Alto:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {detallesPaquete.alto} cm
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {detallesPaquete.peso} kg
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                            Fechas Importantes
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Fecha de registro</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {fechaRegistroFormateada}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Fecha de entrega</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {fechaEntregaFormateada}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </Modal>
    )


}