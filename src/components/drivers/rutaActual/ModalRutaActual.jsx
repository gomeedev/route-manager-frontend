import { useEffect, useState } from "react";

import { Route, Package, User2, Truck, Info } from "lucide-react";
import Directions from '@mui/icons-material/Directions';

import { mostrarRutaActualService } from "../../../global/api/drivers/rutaActual";
import { getConductorByUserId } from "../../../global/api/drivers/rutaActual";
import { calcularRuta } from "../../../global/api/drivers/calcularRuta";
import { iniciarRutaService } from "../../../global/api/drivers/iniciarRuta";

import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";
import { Navigate } from "react-router-dom";




export const ModalRutaActual = ({ onClose = () => { } }) => {
    const [rutaActual, setRutaActual] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCalcular, setLoadingCalcular] = useState(false);


    const getRuta = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem("user"));
            const conductor = await getConductorByUserId(user.id_usuario);
            const ruta = await mostrarRutaActualService(conductor.id_conductor);

            if (ruta.mensaje === "No hay rutas asignadas") {
                setRutaActual(null);
                return;
            }

            setRutaActual(ruta);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRuta();
    }, []);


    const handleCalcularRuta = async () => {
        if (!rutaActual || !rutaActual.id_ruta) {
            console.warn("No hay ruta seleccionada para calcular.");
            return;
        }

        try {
            setLoadingCalcular(true);
            await calcularRuta(rutaActual.id_ruta);

            // Refrescar datos de la ruta para obtener los campos guardados por backend
            await getRuta();

        } catch (error) {

            console.error("Error al calcular la ruta:", error.response?.data || error.message || error);

        } finally {
            setLoadingCalcular(false);
        }
    };


    const handleIniciarRuta = async () => {
        if (!rutaActual?.id_ruta) return;

        try {
            // Llamar al endpoint iniciar_ruta
            await iniciarRutaService(rutaActual.id_ruta);

            // Refrescar datos
            await getRuta();

            onClose()
            Navigate("/driver")

            // Aquí podrías redirigir al mapa de simulación
            // navigate('/driver/mapa-simulacion');

        } catch (error) {
            console.error("Error al iniciar ruta:", error);
        }
    };


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
        };
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

    if (loading) {
        return (
            <div className="w-full flex justify-center py-10">
                <Loading />
            </div>
        );
    }

    if (!rutaActual) {
        return (
            <>
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <Info className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                        No tienes rutas asignadas
                    </p>
                </div>
            </>
        );
    }

    // Utilidad para mostrar orden de paquetes si existe
    const ordenPaquetesIds = () => {
        if (rutaActual.ruta_optimizada?.orden && rutaActual.paquetes_asignados) {
            return rutaActual.ruta_optimizada.orden.map((idx) => {
                const paquete = rutaActual.paquetes_asignados[idx];
                return paquete ? paquete.id_paquete : null;
            }).filter(Boolean);
        }
        return null;
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Detalles de la Ruta
                </h3>
                <Badge color={BadgeColorRuta(rutaActual.estado)}>{rutaActual.estado}</Badge>
            </div>

            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Route className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    Información de la ruta
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Código de Manifiesto</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {rutaActual.codigo_manifiesto}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fecha creación</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {rutaActual.fecha_creacion}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fecha inicio</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {rutaActual.fecha_inicio || "Pendiente"}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fecha fin</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {rutaActual.fecha_fin || "Pendiente"}
                        </p>
                    </div>
                </div>
            </div>

            {/* === Nueva sección: Estado del cálculo de la ruta === */}
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Directions className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    Estado del cálculo de la ruta
                </h4>

                {!(rutaActual.estado === "Asignada" && rutaActual.distancia_total_km && rutaActual.tiempo_estimado_minutos && rutaActual.ruta_optimizada) ? (
                    // Ruta no calculada
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                            La ruta no está calculada.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Distancia total: Pendiente · Tiempo estimado: Pendiente
                        </p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={onClose}
                                className="w-[150px] px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleCalcularRuta}
                                disabled={loadingCalcular}
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingCalcular ? "Calculando..." : "Calcular ruta"}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Ruta ya calculada: mostrar resultados
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Distancia total</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {rutaActual.distancia_total_km} km
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Tiempo estimado</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {rutaActual.tiempo_estimado_minutos} minutos
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                                <span className="text-xs text-gray-600 dark:text-gray-400">Paquetes en orden</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                    {ordenPaquetesIds() ? ordenPaquetesIds().join(" → ") : "No disponible"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleIniciarRuta}
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Iniciar ruta
                            </button>
                        </div>
                    </div>
                )}
            </div>


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
                            {rutaActual.total_paquetes}
                        </span>
                    </div>
                </div>

                {rutaActual.paquetes_asignados && rutaActual.paquetes_asignados.length > 0 ? (
                    <div>
                        <h6 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Paquetes Asignados
                        </h6>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rutaActual.paquetes_asignados.map((paquete) => (
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
            {rutaActual.conductor_detalle ? (
                <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {rutaActual.conductor_detalle?.conductor_detalle?.foto_perfil ? (
                                <img
                                    src={rutaActual.conductor_detalle.conductor_detalle.foto_perfil}
                                    alt="Conductor"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <User2 className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                                Tu información
                            </h4>
                        </div>
                        <Badge color={BadgeColorDriver(rutaActual.conductor_detalle?.estado || "Pendiente")}>
                            {rutaActual.conductor_detalle?.estado || "Pendiente"}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {rutaActual.conductor_detalle?.conductor_detalle?.nombre
                                    ? `${rutaActual.conductor_detalle.conductor_detalle.nombre} ${rutaActual.conductor_detalle.conductor_detalle.apellido}`
                                    : "Pendiente"}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Documento</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {rutaActual.conductor_detalle?.conductor_detalle?.tipo_documento
                                    ? `${rutaActual.conductor_detalle.conductor_detalle.tipo_documento} ${rutaActual.conductor_detalle.conductor_detalle.documento}`
                                    : "Pendiente"}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Correo</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {rutaActual.conductor_detalle?.conductor_detalle?.correo || "Pendiente"}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Teléfono</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {rutaActual.conductor_detalle?.conductor_detalle?.telefono_movil || "Pendiente"}
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
            {rutaActual.conductor_detalle?.vehiculo_detalle ? (
                <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {rutaActual.conductor_detalle?.vehiculo_detalle?.imagen ? (
                                <img
                                    src={rutaActual.conductor_detalle.vehiculo_detalle.imagen}
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
                        <Badge color={BadgeColorDriver(rutaActual.conductor_detalle?.vehiculo_detalle?.estado || "Pendiente")}>
                            {rutaActual.conductor_detalle?.vehiculo_detalle?.estado || "Pendiente"}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tipo de vehículo</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {rutaActual.conductor_detalle?.vehiculo_detalle?.tipo || "Pendiente"}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Placa</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                                {rutaActual.conductor_detalle?.vehiculo_detalle?.placa || "Pendiente"}
                            </p>
                        </div>
                    </div>
                </div>
            ) : rutaActual.conductor_detalle && (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg mt-6">
                    <Truck className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay vehículo asignado a este conductor
                    </p>
                </div>
            )}
        </div>
    );

};
