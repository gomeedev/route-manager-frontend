import { useState } from "react";

const FormularioEntrega = ({ paquete, onSubmit, onClose }) => {
    const [estadoEntrega, setEstadoEntrega] = useState("Entregado");
    const [archivo, setArchivo] = useState(null);
    const [observacion, setObservacion] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConfirmar = async () => {
        if (loading) return;

        // Validación: foto obligatoria
        if (!archivo) {
            alert("Debes adjuntar una foto de evidencia");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(estadoEntrega, archivo, observacion);
            // El modal se cierra automáticamente después de onSubmit exitoso
        } catch (err) {
            console.error("Error al confirmar entrega:", err);
            alert("Error al guardar la entrega");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                📦 Confirmar entrega
            </h2>

            {/* Información del paquete */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">
                        {paquete?.orden_entrega || "?"}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">
                        Paquete #{paquete?.id_paquete}
                    </span>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cliente:</span>
                        <span className="font-medium text-gray-900 dark:text-white text-right">
                            {paquete?.cliente_detalle?.nombre || paquete?.destinatario_nombre || "N/A"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Teléfono:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {paquete?.destinatario_telefono || "N/A"}
                        </span>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                        <span className="text-gray-600 dark:text-gray-400 block mb-1">Dirección:</span>
                        <span className="font-medium text-gray-900 dark:text-white block">
                            {paquete?.direccion_entrega || "No registrada"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Estado de entrega */}
            <label className="block mb-4">
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-2 block">
                    Estado de la entrega *
                </span>
                <select
                    className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={estadoEntrega}
                    onChange={(e) => setEstadoEntrega(e.target.value)}
                >
                    <option value="Entregado">✅ Entregado</option>
                    <option value="Fallido">❌ Fallido</option>
                </select>
            </label>

            {/* Foto evidencia */}
            <label className="block mb-5">
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-2 block">
                    Foto evidencia *
                </span>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                        onChange={(e) => setArchivo(e.target.files[0])}
                    />
                </div>
                {archivo && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{archivo.name}</span>
                    </div>
                )}
                {!archivo && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Toma una foto de la evidencia de entrega
                    </p>
                )}
            </label>

            {/* Observación */}
            <label className="block mb-6">
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-2 block">
                    Observación (opcional)
                </span>
                <textarea
                    className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Ej: Cliente no estaba, dejé con portero..."
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                />
            </label>

            {/* Botones */}
            <div className="flex gap-3">
                <button
                    onClick={handleConfirmar}
                    disabled={loading || !archivo}
                    className="flex-1 px-6 py-3 text-base font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 disabled:hover:bg-green-600"
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

            {!archivo && (
                <p className="mt-3 text-center text-sm text-red-500 dark:text-red-400">
                    ⚠️ La foto es obligatoria para continuar
                </p>
            )}
        </div>
    );
};

export default FormularioEntrega;