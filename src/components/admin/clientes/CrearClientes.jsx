import { useState } from "react";

import { Plus } from "lucide-react";

import { toast } from "sonner";

import { PostClientsManagementService } from "../../../global/api/admin/ClientsManagementService";

import Input from "../../form/input/InputField";
import Select from "../../form/input/Select";
import { Modal } from "../../ui/modal/Modal"
import Loading from "../../common/Loading";
import { Add } from "@mui/icons-material";




export const CrearClientes = ({ onClose, refreshTable }) => {

    const [clientes, setClientes] = useState("")
    const [name, setName] = useState("")
    const [apellido, setApellido] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [direccion, setDireccion] = useState("")
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)

        const data = {
            nombre: name,
            apellido: apellido,
            correo: email,
            telefono_movil: telefono,
            direccion: direccion,
        }

        try {

            await PostClientsManagementService(data)
            toast.success("Vehiculo creado correctamente")
            refreshTable();
            onClose();

        } catch (error) {

            toast.error(error.response?.data?.details || "Error al crear el vehículo");

        } finally {
            setLoading(false)
            setName("")
            setApellido("")
            setEmail("")
            setTelefono("")
            setDireccion("")
        }
    }


    return (

        <Modal
            isOpen={true}
            onClose={onClose}
            showCloseButton={true}
        >

            {loading ? (
                <div className="w-full flex justify-center py-10">
                    <Loading />
                </div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 pl-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Add className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Agregar cliente
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">

                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                                Información del cliente
                            </h4>

                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Nombre <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Johann"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required

                                    />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Apelldio <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Gómez"
                                        value={apellido}
                                        onChange={(e) => setApellido(e.target.value)}
                                        required

                                    />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        correo <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="johann@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required

                                    />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Telefono <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="302345697"
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
                                        placeholder="302345697"
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
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600/15 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Crear
                            </button>
                        </div>
                    </form>

                </div>
            )}

        </Modal>
    )
}