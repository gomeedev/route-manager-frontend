import { useState, useEffect } from "react";
import { Edit, User } from "lucide-react";

import { toast } from "sonner";

import { EditConductorService, getDetallesConductorService } from "../../../global/api/admin/DriversManagementService";

import Input from "../../form/input/InputField";
import Select from "../../form/input/Select";
import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";


export const EditarConductor = ({ driverId, onClose, refreshTable }) => {


    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono_movil, setTelefono_movil] = useState("");
    const [tipo_documento, setTipoDocumento] = useState("");
    const [documento, setDocumento] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [estadoUsuario, setEstadoUsuario] = useState("");

    const [loading, setLoading] = useState(true);

    const opcionestipoDocumento = [
        { value: "CC", label: "Cédula de ciudadanía" },
        { value: "CE", label: "Cédula de extranjería" },
        { value: "TI", label: "Tarjeta de identidad" },
    ];

    const opcionesEstadoUsuario = [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
    ];



    const cargarDatos = async () => {
        try {
            const data = await getDetallesConductorService(driverId);

            setNombre(data.conductor_detalle.nombre ?? "");
            setApellido(data.conductor_detalle.apellido ?? "");
            setTelefono_movil(data.conductor_detalle.telefono_movil ?? "");
            setTipoDocumento(data.conductor_detalle.tipo_documento ?? "");
            setDocumento(data.conductor_detalle.documento ?? "");
            setCorreo(data.conductor_detalle.correo ?? "");
            setDireccion(data.direccion_base ?? "");
            setEstadoUsuario(data.conductor_detalle.estado ?? "");


        } catch (error) {

            toast.error("No se pudieron cargar los datos del conductor");
            onClose();

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        if (driverId) {

            cargarDatos();
        }

    }, [driverId]);



    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedData = {
            nombre,
            apellido,
            telefono_movil,
            tipo_documento,
            documento,
            correo,
            direccion_base: direccion,
            estado: estadoUsuario
        };

        try {

            await EditConductorService(driverId, updatedData);
            toast.success("Conductor actualizado");

            onClose();
            refreshTable();

        } catch (error) {
            toast.error(error.response?.data?.error || "No se pudo actualizar el conductor");
        }
    };


    return (

        <Modal isOpen={true} onClose={onClose} showCloseButton>
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
                            Editar conductor
                        </h3>
                    </div>


                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">

                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                                <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                Información del conductor
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                                        Télefono movil <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={telefono_movil}
                                        onChange={(e) => setTelefono_movil(e.target.value)}
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
                                        Tipo de documento <span className="text-error-500">*</span>
                                    </label>
                                    <Select
                                        defaultValue={tipo_documento}
                                        options={opcionestipoDocumento}
                                        onChange={(value) => setTipoDocumento(value)}
                                        className={"block text-[15px] mb-2 text-gray-700 dark:text-gray-400"}
                                    />

                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Numero de documento <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={documento}
                                        onChange={(e) => setDocumento(e.target.value)}
                                        required

                                    />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Direcciòn <span className="text-error-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        required

                                    />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                        Estado <span className="text-error-500">*</span>
                                    </label>
                                    <Select
                                        options={opcionesEstadoUsuario}
                                        defaultValue={estadoUsuario}
                                        onChange={(value) => setEstadoUsuario(value)}
                                        className={"block text-[15px] mb-2 text-gray-700 dark:text-gray-400"}
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
    );
};
