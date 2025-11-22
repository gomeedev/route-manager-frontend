import { useState } from "react";

import { Plus } from "lucide-react";

import { toast } from "sonner";

import { PostVehiclesManagement } from "../../../global/api/admin/VehiclesManagementService";

import Input from "../../form/input/InputField";
import Select from "../../form/input/Select";
import { Modal } from "../../ui/modal/Modal"
import Loading from "../../common/Loading";
import { Add } from "@mui/icons-material";




export const CrearVehiculos = ({ onClose, refreshTable }) => {

    const [vehiculo, setVehiculo] = useState("")
    const [tipoVehiculo, setTipoVehiculo] = useState("")
    const [placa, setPlaca] = useState("")
    const [photo, setPhoto] = useState(false)
    const [loading, setLoading] = useState(false)


    const opcionesTipoVehiculo = [
        { value: "Camion", label: "Camión" },
        { value: "Furgon", label: "Furgón" },
        { value: "Camioneta", label: "Camioneta" },
        { value: "Moto", label: "Moto" },
    ]


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)

        const formData = new FormData();

        formData.append("tipo", tipoVehiculo)
        formData.append("placa", placa)

        if (photo && typeof photo !== "string") {
            formData.append("foto", photo)
        }

        try {

            await PostVehiclesManagement(formData)
            toast.success("Vehiculo creado correctamente")
            refreshTable();
            onClose();

        } catch (error) {

            toast.error("Error al crear el vehiculo")

        } finally {
            setLoading(false)
            setTipoVehiculo("")
            setPlaca("")
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
                            Agregar vehiculo
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">

                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                                Información del vehiculo
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div>
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                        <div className="flex-1 w-full">
                                            <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                                Subir foto del vehiculo <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setPhoto(e.target.files[0])}
                                            />
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Formatos aceptados: Imagenes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Tipo de vehiculo <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        placeholder="Selecciona el tipo de vehiculo"
                                        defaultValue={tipoVehiculo}
                                        onChange={(value) => setTipoVehiculo(value)}
                                        options={opcionesTipoVehiculo.slice(0)}
                                        required
                                    >
                                    </Select>

                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Placa <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="AAA123"
                                        value={placa}
                                        onChange={(e) => setPlaca(e.target.value)}
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