import { useState } from "react"
import { User, Mail, Phone, FileText, Building2, Calendar, Edit2 } from "lucide-react"

import { EditarPerfilDriver } from "./EditarPerfilDriver"
import { fotoDefaultUrl } from "../../../global/supabase/storageService"
import { Modal } from "../../ui/modal/Modal"

import ComponentCard from "../../common/ComponentCard"
import Badge from "../../ui/badge/Badge"


export const MostrarPerfilDriver = () => {

    const [IsModalOpen, setIsModalOpen] = useState(false)

    let user = JSON.parse(localStorage.getItem("user"))

    const fechaBackend = user.fecha_actualizacion_foto
    const fecha = new Date(fechaBackend)
    const formatoFecha = new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(fecha)

    switch (user.tipo_documento) {
        case "CC":
            user.tipo_documento = "Cédula de ciudadania"
            break
        case "TI":
            user.tipo_documento = "Tarjeta de identidad"
        case "CE":
            user.tipo_documento = "Cédula de extranjeria"
            break
    }

    return (
        <>
            <ComponentCard title={
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 className="size-4" />
                    <p>Perteneces a la empresa <i><span className="text-gray-800 dark:text-white">{user.empresa_nombre}</span></i></p>
                </div>
            }>
                <div className="space-y-6">
                    {/* Header con foto y estado */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <img
                                src={user.foto_perfil || fotoDefaultUrl}
                                alt="Foto de perfil"
                                className="rounded-full w-24 h-24 sm:w-28 sm:h-28 object-cover ring-4 ring-gray-100 dark:ring-gray-700"
                            />
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
                                {user.nombre} {user.apellido}
                            </h2>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3 mt-3">
                                <Badge>{user.rol_nombre}</Badge>
                                <Badge color="success">{user.estado}</Badge>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="size-3.5" />
                                <span>Última actualización de tu foto: <i className="font-medium text-gray-800 dark:text-white truncate">{formatoFecha || "No has subido foto"}</i></span>
                            </div>
                        </div>
                    </div>

                    {/* Información personal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                            Información Personal
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="mt-0.5">
                                    <User className="size-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Nombre Completo</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.nombre} {user.apellido}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="mt-0.5">
                                    <FileText className="size-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Tipo de Documento</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.tipo_documento}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="mt-0.5">
                                    <FileText className="size-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Número de Documento</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.documento}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="mt-0.5">
                                    <Mail className="size-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Correo Electrónico</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.correo}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 sm:col-span-2">
                                <div className="mt-0.5">
                                    <Phone className="size-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Teléfono Móvil</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.telefono_movil}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botón de editar */}
                    <div className="pt-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Edit2 className="size-4" />
                            Editar Perfil
                        </button>
                    </div>
                </div>

                <Modal isOpen={IsModalOpen} onClose={() => setIsModalOpen(false)} showCloseButton={true}>
                    <EditarPerfilDriver />
                </Modal>

            </ComponentCard>
        </>
    )
}
