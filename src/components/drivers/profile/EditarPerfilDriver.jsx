import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, FileText, Building2, Camera } from "lucide-react";

import { EditProfileUser } from "../../../global/api/UsersService";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";
import Input from "../../form/input/InputField";


export const EditarPerfilDriver = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
    const [photo, setPhoto] = useState(user.foto_perfil || "")
    const [email, setEmail] = useState(user.correo || "")
    const [phone, setPhone] = useState(user.telefono_movil || "")


    const handleSubmit = async (event) => {
        event.preventDefault()

        const formData = new FormData();

        if (photo && typeof photo !== "string") {
            formData.append("foto", photo)
        }

        formData.append("correo", email)
        formData.append("telefono_movil", phone)


        try {

            const updateUser = await EditProfileUser(user.id_usuario, formData);

            localStorage.setItem("user", JSON.stringify(updateUser))
            setUser(updateUser)

            toast.success("Datos del perfil actualizados")

            setTimeout(() => {
                window.location.reload()
            }, 1000);

        } catch (error) {
            toast.error("Error al actualizar el perfil")

        }

    }


    // Formatear valores incomodos del objeto
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

    switch (user.rol_nombre) {
        case "driver":
            user.rol_nombre = "Conductor"
            break
        case "admin":
            user.rol_nombre = "Administrador"
            break
    }

    switch (user.estado) {
        case "activo":
            user.estado = "Activo"
            break
        case "inactivo":
            user.estado = "Inactivo"
            break
    }


    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2 p-2">
                    Editar Perfil
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Actualiza tu información personal <span className="font-bold">básica</span>
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">

                    {/* Sección de Foto de Perfil */}
                    <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative">
                                {typeof photo === "string" ? (
                                    <img
                                        src={photo || fotoDefaultUrl}
                                        alt="Foto actual"
                                        className="rounded-full w-24 h-24 sm:w-28 sm:h-28 object-cover ring-4 ring-gray-100 dark:ring-gray-700"
                                    />
                                ) : (
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Nueva foto"
                                        className="rounded-full w-24 h-24 sm:w-28 sm:h-28 object-cover ring-4 ring-gray-100 dark:ring-gray-700"
                                    />
                                )}
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                                    <Camera className="size-4 text-white" />
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                    Foto de Perfil
                                </label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                />
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Formatos aceptados: JPG, PNG. Tamaño máximo: 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información de la Empresa (Solo lectura) */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                            Información de la Empresa
                        </h3>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <div className="mt-0.5">
                                <Building2 className="size-4 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Empresa</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                    {user.empresa_nombre}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información Personal (Solo lectura) */}
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
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Nombre</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.nombre}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="mt-0.5">
                                    <User className="size-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Apellido</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.apellido}
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
                                    <FileText className="size-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Rol</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.rol_nombre}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="mt-0.5">
                                    <FileText className="size-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Estado</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {user.estado}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información de Contacto (Editable) */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                            Información de Contacto
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                    <Mail className="size-4" />
                                    Correo Electrónico <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Ingresa tu correo"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                    <Phone className="size-4" />
                                    Teléfono Móvil <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Ingresa tu teléfono"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botón de Guardar */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </form>
        </>

    )

}
