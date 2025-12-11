import { Check, Package, Package2 } from "lucide-react";
import { useState } from "react";
import Select from "../../form/input/Select";
import Input from "../../form/input/InputField";
import Badge from "../../ui/badge/Badge";
import { toast } from "sonner";

const FormularioEntrega = ({ paquete, onSubmit, onClose }) => {
    const [estadoEntrega, setEstadoEntrega] = useState("Entregado");
    const [archivo, setArchivo] = useState(null);
    const [observacion, setObservacion] = useState("");
    const [loading, setLoading] = useState(false);


    const opcionesEntrgea = [
        { value: "Entregado", label: "Entregado" },
        { value: "Fallido", label: "Fallido" }
    ]

    const handleConfirmar = async () => {
        if (loading) return;

        // Validación: foto obligatoria
        if (!archivo) {
            toast.error("Debes adjuntar una foto de evidencia")
            return;
        }

        setLoading(true);
        try {
            await onSubmit(estadoEntrega, archivo, observacion);
            // El modal se cierra automáticamente después de onSubmit exitoso
        } catch (err) {
            console.error("Error al confirmar entrega:", err);
            toast.error("Error al guardar la entrega");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Marcar Entrega
                </h3>
            </div>

            {/* Información del paquete */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    Información del paquete
                </h4>

                <div className="flex items-center gap-2 mb-4 mt-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">
                        {paquete?.orden_entrega || "?"}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">
                        Paquete #{paquete?.id_paquete}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Cliente</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {paquete?.destinatario_nombre || "N/A"} {paquete?.destinatario_apellido || "N/A"}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Telefono</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {paquete?.destinatario_telefono || "N/A"}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Correo</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {paquete?.destinatario_correo || "N/A"}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Dirección</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                            {paquete?.direccion_entrega || "No registrada"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div>
                        <h4 className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                            Estado de la entrega <span className="text-red-500">*</span>
                        </h4>
                        <Select
                            placeholder="Selecciona estado de entrega"
                            options={opcionesEntrgea.slice(0)}
                            defaultValue={estadoEntrega}
                            onChange={(value) => setEstadoEntrega(value)}
                            required
                        />
                    </div>
                    <div className="mt-6">
                        <h4 className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                            Foto de evidencia <span className="text-red-500">*</span>
                        </h4>
                        <div className="relative">
                            <Input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => setArchivo(e.target.files[0])}
                            />
                        </div>
                        {archivo && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <Badge color="success">{archivo.name}</Badge>
                            </div>
                        )}
                        {!archivo && (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Toma una foto de la evidencia de entrega
                            </p>
                        )}
                    </div>
                    <div className="mt-6">
                        <h4 className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                            Observación <span className="text-red-500">*</span>
                        </h4>
                        <textarea
                            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            placeholder="Ej: Cliente no estaba, dejé con portero..."
                            value={observacion}
                            onChange={(e) => setObservacion(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Botones */}
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button
                    onClick={handleConfirmar}
                    disabled={loading || !archivo}
                    className="lex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Guardando...
                        </span>
                    ) : (
                        "Confirmar entrega"
                    )}
                </button>
            </div>
        </div>
    );
};

export default FormularioEntrega;