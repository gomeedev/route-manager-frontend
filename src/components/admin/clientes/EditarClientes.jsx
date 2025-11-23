import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { toast } from "sonner";

import { GetClientsDetailsService, EditClientsManagementService } from "../../../global/api/admin/ClientsManagementService";

import Input from "../../form/input/InputField";
import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";




export const EditarCliente = ({ clientId, onClose, refreshTable }) => {

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [loading, setLoading] = useState(true);


    const cargarDatos = async () => {

        try {
            const data = await GetClientsDetailsService(clientId);

            setNombre(data.nombre);
            setApellido(data.apellido);
            setCorreo(data.correo);
            setTelefono(data.telefono_movil);
            setDireccion(data.direccion);

        } catch (error) {

            toast.error("No se pudieron cargar los datos del cliente");
            onClose();

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clientId) cargarDatos();
    }, [clientId]);


    const handleSubmit = async (event) => {
        event.preventDefault();


        const data = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            telefono_movil: telefono,
            direccion: direccion
        }

        try {
            await EditClientsManagementService(clientId, data);
            toast.success("Cliente actualizado");

            onClose();
            refreshTable();
        } catch (error) {
            toast.error(error.response?.data?.error || "No se pudo actualizar el cliente");
        }
    };

    return (

        <Modal isOpen={true} onClose={onClose} showCloseButton={true}>
            {loading ? (
                <div className="w-full flex justify-center py-10">
                    <Loading />
                </div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 pl-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Edit className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Editar cliente
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Información del cliente
                            </h4>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Nombre <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Apellido <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={apellido}
                                        onChange={(e) => setApellido(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Correo <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Teléfono <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Dirección <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        required
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600/15"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                            >
                                Actualizar
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </Modal>
    );
};
