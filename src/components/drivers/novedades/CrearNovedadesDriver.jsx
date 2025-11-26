import { useState } from "react";
import { Plus } from 'lucide-react';
import { toast } from "sonner";
import { PostNovedades } from "../../../global/api/NovedadesService";
import Input from "../../form/input/InputField";
import TextAreaField from "../../form/input/TextArea"
import Select from "../../form/input/Select";
import { Modal } from "../../ui/modal/Modal"
import Loading from "../../common/Loading";

// ✨ NUEVO: Componente solo con el formulario (sin modal propio)
export const FormularioCrearNovedad = ({ onClose }) => {
    const [typeNovedad, setTypeNovedad] = useState("")
    const [description, setDescription] = useState("")
    const [photo, setPhoto] = useState(false)
    const [loading, setLoading] = useState(false)

    const opcionesTipoNovedad = [
        { value: "problemas_entrega", label: "Problemas de entrega" },
        { value: "problemas_destinatario", label: "Problemas con el destinatario" },
        { value: "demoras_operativas", label: "Demoras operativas" },
        { value: "problemas_documentacion", label: "Problemas de documentación" }
    ]

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("tipo", typeNovedad)
        formData.append("descripcion", description)

        if (photo && typeof photo !== "string") {
            formData.append("foto", photo)
        }

        try {
            const CreateNovedad = await PostNovedades(formData);
            toast.success("Novedad creada correctamente")
            onClose?.(); // Cierra el modal del sidebar
        } catch (error) {
            toast.error("Error al crear la novedad")
        } finally {
            setLoading(false)
            setTypeNovedad("")
            setDescription("")
        }
    }

    return (
        <>
            {loading && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                    <Loading />
                </div>
            )}

            <div className="mb-6 pl-6 pl-12 pr-12">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-4 mb-2">
                    Crear Novedad
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Reporta tu situación a algún administrador del sistema
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6 pl-12 pr-12">
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                Tipo de novedad <span className="text-red-500">*</span>
                            </label>
                            <Select
                                placeholder="Selecciona el tipo de novedad"
                                defaultValue={typeNovedad}
                                onChange={(value) => setTypeNovedad(value)}
                                options={opcionesTipoNovedad.slice(0)}
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <TextAreaField
                                placeholder="Cuéntanos más sobre tu novedad"
                                max={200}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                        <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <div className="flex-1 w-full">
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Enviar comprobante (Opcional)
                                    </label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Formatos aceptados: Imágenes. Tamaño máximo: 5MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Enviando..." : "Enviar novedad"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

// 🔄 MANTÉN: Componente original con su propio modal (por si se usa en otro lugar)
export const CrearNovedadesDriver = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                <Plus className="w-4 h-4" />
                Crear novedad
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} showCloseButton={true}>
                <FormularioCrearNovedad onClose={() => setIsModalOpen(false)} />
            </Modal>
        </>
    )
}