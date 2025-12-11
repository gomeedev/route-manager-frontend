import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Edit, User, Route, User2, Truck } from "lucide-react";
import { Package } from "lucide-react";

import { GetDetailsRoutesManagement } from "../../../global/api/admin/RoutesManagementService";

import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";
import Badge from "../../ui/badge/Badge";




export const MostrarDetallesRuta = ({ routeId, onClose }) => {
    const [detallesRuta, setDetallesRuta] = useState(null)
    const [loading, setLoading] = useState(true)


    const verDetalles = async (id_ruta) => {

        try {

            const ruta = await GetDetailsRoutesManagement(id_ruta)
            setDetallesRuta(ruta)

        } catch (error) {

            toast.error("No se pudieron cargar los detalles de la ruta")

        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (routeId) {
            verDetalles(routeId)
        }
    }, [routeId])



    function BadgeColorRuta(estado) {
        const colorMap = {
            "Pendiente": "warning",
            "Asignada": "primary",
            "En ruta": "info",
            "Completada": "success",
            "Fallida": "error",
        };
        return colorMap[estado] || "primary";
    }

    function BadgeColorDriver(estado) {
        const colorMap = {
            "Disponible": "success",
            "Asignado": "primary",
            "En ruta": "warning",
            "No disponible": "error",
        }
        return colorMap[estado] || "primary";
    }

    function getColorEstadoPaquete(estado) {
        const colorMap = {
            "Pendiente": "warning",
            "Asignado": "primary",
            "En ruta": "info",
            "Entregado": "success",
            "Fallido": "error",
        };
        return colorMap[estado] || "primary";
    }


    return (
        <Modal isOpen={true} onClose={onClose} showCloseButton={true}>
            {loading ? (
                <div className="w-full flex justify-center py-10">
                    <Loading />
                </div>
            ) : <>
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Detalles de la Ruta
                        </h3>
                        <Badge color={BadgeColorRuta(detallesRuta.estado)}>{detallesRuta.estado}</Badge>
                    </div>

                    <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <Route className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                            Información de la ruta
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Código de Manifiesto</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesRuta.codigo_manifiesto}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Fecha creación</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesRuta.fecha_creacion ? new Date(detallesRuta.fecha_creacion).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : "Pendiente"}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Fecha inicio</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesRuta.fecha_inicio ? new Date(detallesRuta.fecha_inicio).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : "Pendiente"}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Fecha fin</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesRuta.fecha_fin ? new Date(detallesRuta.fecha_fin).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : "Pendiente"}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Distancia total en km</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesRuta.distancia_total_km || "Pendiente"} km
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Tiempo estimado en minutos</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {detallesRuta.tiempo_estimado_minutos || "Pendiente"} minutos
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información de los paquetes */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                            Información de los paquetes
                        </h4>

                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total de Paquetes:
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {detallesRuta.total_paquetes}
                                </span>
                            </div>
                        </div>

                        {detallesRuta.paquetes_asignados && detallesRuta.paquetes_asignados.length > 0 ? (
                            <div>
                                <h6 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Paquetes Asignados
                                </h6>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {detallesRuta.paquetes_asignados.map((paquete) => (
                                        <div
                                            key={paquete.id_paquete}
                                            className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    Paquete #{paquete.id_paquete}
                                                </span>
                                                <Badge
                                                    size="sm"
                                                    color={getColorEstadoPaquete(paquete.estado_paquete)}
                                                >
                                                    {paquete.estado_paquete}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        Destinatario:
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-900 dark:text-white text-right">
                                                        {paquete.destinatario_nombre} {paquete.destinatario_apellido || "-"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        Teléfono:
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                                        {paquete.destinatario_telefono || "-"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        Cantidad:
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                                        {paquete.cantidad}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        Tipo:
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                                        {paquete.tipo_paquete}
                                                    </span>
                                                </div>

                                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        Dirección de entrega:
                                                    </span>
                                                    <p className="text-xs font-medium text-gray-900 dark:text-white mt-1 leading-relaxed">
                                                        {paquete.direccion_entrega || "-"}
                                                    </p>
                                                </div>

                                                {paquete.localidad_detalle && (
                                                    <div className="dark:border-gray-600">
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                                            Dirección de entrega:
                                                        </span>
                                                        <p className="text-xs font-medium text-gray-900 dark:text-white mt-1 leading-relaxed">
                                                            {paquete.localidad_detalle.nombre || "-"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <Package className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No hay paquetes asignados a esta ruta
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Información del conductor */}
                    {detallesRuta.conductor_detalle ? (
                        <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {detallesRuta.conductor_detalle?.conductor_detalle?.foto_perfil ? (
                                        <img
                                            src={detallesRuta.conductor_detalle.conductor_detalle.foto_perfil}
                                            alt="Conductor"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                            <User2 className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                                        Información del conductor
                                    </h4>
                                </div>
                                <Badge color={BadgeColorDriver(detallesRuta.conductor_detalle?.estado || "Pendiente")}>
                                    {detallesRuta.conductor_detalle?.estado || "Pendiente"}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                        {detallesRuta.conductor_detalle?.conductor_detalle?.nombre
                                            ? `${detallesRuta.conductor_detalle.conductor_detalle.nombre} ${detallesRuta.conductor_detalle.conductor_detalle.apellido}`
                                            : "Pendiente"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Documento</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                        {detallesRuta.conductor_detalle?.conductor_detalle?.tipo_documento
                                            ? `${detallesRuta.conductor_detalle.conductor_detalle.tipo_documento} ${detallesRuta.conductor_detalle.conductor_detalle.documento}`
                                            : "Pendiente"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Correo</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                        {detallesRuta.conductor_detalle?.conductor_detalle?.correo || "Pendiente"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Teléfono</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                        {detallesRuta.conductor_detalle?.conductor_detalle?.telefono_movil || "Pendiente"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg mt-6">
                            <User2 className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay conductor asignado a esta ruta
                            </p>
                        </div>
                    )}

                    {/* Información del vehículo */}
                    {detallesRuta.conductor_detalle?.vehiculo_detalle ? (
                        <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {detallesRuta.conductor_detalle?.vehiculo_detalle?.imagen ? (
                                        <img
                                            src={detallesRuta.conductor_detalle.vehiculo_detalle.imagen}
                                            alt="Vehículo"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
                                        />
                                    ) : (
                                        <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
                                            <Truck className="w-7 h-7 text-white" />
                                        </div>
                                    )}
                                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                                        Información del vehículo
                                    </h4>
                                </div>
                                <Badge color={BadgeColorDriver(detallesRuta.conductor_detalle?.vehiculo_detalle?.estado || "Pendiente")}>
                                    {detallesRuta.conductor_detalle?.vehiculo_detalle?.estado || "Pendiente"}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tipo de vehículo</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                        {detallesRuta.conductor_detalle?.vehiculo_detalle?.tipo || "Pendiente"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Placa</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                        {detallesRuta.conductor_detalle?.vehiculo_detalle?.placa || "Pendiente"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : detallesRuta.conductor_detalle && (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg mt-6">
                            <Truck className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay vehículo asignado a este conductor
                            </p>
                        </div>
                    )}


                </div>
            </>}
        </Modal>
    )


}
