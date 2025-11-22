import { useState, useEffect } from "react";

import { Camera, Edit, User } from "lucide-react";

import { toast } from "sonner";

import { getVehiclesDetalles, EditVehiclesManagement } from "../../../global/api/admin/VehiclesManagementService";

import Input from "../../form/input/InputField";
import Select from "../../form/input/Select";
import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";




export const EditarVehiculo = ({ vehicleId, onClose, refreshTable }) => {

    const [tipoVehiculo, setTipoVehiculo] = useState("")
    const [placa, setPlaca] = useState("")
    const [photo, setPhoto] = useState(false)
    const [loading, setLoading] = useState(true)


    const opcionesTipoVehiculo = [
        { value: "Camion", label: "Camión" },
        { value: "Furgon", label: "Furgón" },
        { value: "Camioneta", label: "Camioneta" },
        { value: "Moto", label: "Moto" },
    ]


    const cargarDatos = async () => {

        try {
            const data = await getVehiclesDetalles(vehicleId)

            setTipoVehiculo(data.tipo)
            setPlaca(data.placa)
            setPhoto(data.imagen)

        } catch (error) {

            toast.error("No se pudieron cargar los datos del vehiculos")
            onClose();

        } finally {

            setLoading(false)
        }

    }


    useEffect(() => {

        if (vehicleId) {

            cargarDatos()
        };
    }, [vehicleId]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("tipo", tipoVehiculo);
        formData.append("placa", placa);

        if (photo && typeof photo !== "string") {
            formData.append("foto", photo);
        }


        try {
            await EditVehiclesManagement(vehicleId, formData)
            toast.success("Vehiculo actualizado")

            onClose();
            refreshTable();

        } catch (error) {

            toast.error(error.response?.data?.error || "No se puedo actualizar el vehiculo")

        }
    };


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
                            <Edit className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Editar vehiculo
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                                Información del vehiculo
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                        <div className="relative">
                                            {photo && typeof photo === "object" ? (
                                                // Es un File (nueva foto)
                                                <img
                                                    src={URL.createObjectURL(photo)}
                                                    alt="Nueva foto"
                                                    className="rounded-full w-24 h-24 sm:w-28 sm:h-28 object-cover ring-4 ring-gray-100 dark:ring-gray-700"
                                                />
                                            ) : photo && typeof photo === "string" ? (
                                                // Foto URL existente
                                                <img
                                                    src={photo}
                                                    alt="Foto actual"
                                                    className="rounded-full w-24 h-24 sm:w-28 sm:h-28 object-cover ring-4 ring-gray-100 dark:ring-gray-700"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                                    Sin foto
                                                </div>
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
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Tipo <span className="text-error-500">*</span>
                                    </label>
                                    <Select
                                        placeholder="Seleccion el tipo de vehiculo"
                                        defaultValue={tipoVehiculo}
                                        onChange={(evento) => setTipoVehiculo(evento)}
                                        options={opcionesTipoVehiculo.slice(0)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Placa <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
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
                                Actualizar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </Modal>
    )

}