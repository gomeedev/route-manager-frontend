import { useState } from "react";
import { toast } from "sonner";

import { Plus, User } from "lucide-react";

import { PostPackagesManagementService } from "../../../global/api/admin/PackagesManagementService";
import { AsignarClientes } from "./AsignarClientes";

import Input from "../../form/input/InputField";
import Select from "../../form/input/Select";
import { Modal } from "../../ui/modal/Modal";
import Loading from "../../common/Loading";




export const CrearPaquetes = ({ onClose, refreshTable }) => {

    const [loading, setLoading] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [isModalClienteOpen, setIsModalClienteOpen] = useState(false);

    const [destinatarioNombre, setDestinatarioNombre] = useState("");
    const [destinatarioApellido, setDestinatarioApellido] = useState("");
    const [destinatarioTelefono, setDestinatarioTelefono] = useState("");
    const [destinatarioCorreo, setDestinatarioCorreo] = useState("");

    const [tipo, setTipo] = useState("");

    const [largo, setLargo] = useState("");
    const [ancho, setAncho] = useState("");
    const [alto, setAlto] = useState("");
    const [peso, setPeso] = useState("");
    const [valorDeclarado, setValorDeclarado] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [direccionEntrega, setDireccionEntrega] = useState("");

    const opcionesTipoLocalidad = [
        { value: 15, label: "Antonio Nariño" },
        { value: 12, label: "Barrios Unidos" },
        { value: 7, label: "Bosa" },
        { value: 2, label: "Chapinero" },
        { value: 19, label: "Ciudad Bolívar" },
        { value: 10, label: "Engativá" },
        { value: 9, label: "Fontibón" },
        { value: 8, label: "Kennedy" },
        { value: 17, label: "La Candelaria" },
        { value: 14, label: "Los Mártires" },
        { value: 16, label: "Puente Aranda" },
        { value: 18, label: "Rafael Uribe Uribe" },
        { value: 4, label: "San Cristóbal" },
        { value: 3, label: "Santa Fe" },
        { value: 11, label: "Suba" },
        { value: 20, label: "Sumapaz" },
        { value: 13, label: "Teusaquillo" },
        { value: 6, label: "Tunjuelito" },
        { value: 1, label: "Usaquén" },
        { value: 5, label: "Usme" }
    ];

    const opcionesTipoPaquete = [
        { value: "Grande", label: "Grande" },
        { value: "Mediano", label: "Mediano" },
        { value: "Pequeno", label: "Pequeño" },
        { value: "Refrigerado", label: "Refrigerado" },
        { value: "Fragil", label: "Fragil" },
    ];

    const handleSelectCliente = (cliente) => {
        setClienteSeleccionado(cliente);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !largo || !ancho || !alto || !peso || !tipo ||
            !valorDeclarado || !cantidad ||
            !clienteSeleccionado || !localidad || !direccionEntrega ||
            !destinatarioNombre || !destinatarioApellido || !destinatarioTelefono || !destinatarioCorreo
        ) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                largo: Number(largo),
                ancho: Number(ancho),
                alto: Number(alto),
                peso: Number(peso),
                valor_declarado: valorDeclarado,
                cantidad: Number(cantidad),
                cliente: clienteSeleccionado.id_cliente,
                localidad,
                tipo,
                direccion_entrega: direccionEntrega,
                destinatario_nombre: destinatarioNombre,
                destinatario_apellido: destinatarioApellido,
                destinatario_telefono: destinatarioTelefono,
                destinatario_correo: destinatarioCorreo
            };

            await PostPackagesManagementService(payload);

            toast.success("Paquete creado correctamente");
            refreshTable();
            onClose();

        } catch (error) {
            toast.error(error.response?.data?.details || error.response?.data?.message || "Error al crear el paquete");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={true} onClose={onClose} showCloseButton={true}>
                {loading ? (
                    <div className="w-full flex items-center justify-center py-10">
                        <Loading />
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 pl-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Plus className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Agregar Paquete
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Selección de cliente */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <h4 className="block text-[15px] mb-3 text-gray-700 dark:text-gray-400">
                                    Selecciona un cliente <span className="text-red-500">*</span>
                                </h4>

                                {clienteSeleccionado ? (
                                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-success-500/10 rounded-lg">
                                                <User className="w-5 h-5 text-success-600 dark:text-success-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {clienteSeleccionado.correo}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalClienteOpen(true)}
                                            className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsModalClienteOpen(true)}
                                        className="w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-solid border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-colors"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <User className="w-5 h-5" />
                                            <span>Seleccionar cliente</span>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Información del destinatario */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    Información del destinatario
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Nombre del destinatario"
                                            value={destinatarioNombre}
                                            onChange={(e) => setDestinatarioNombre(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Apellido <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Apellido del destinatario"
                                            value={destinatarioApellido}
                                            onChange={(e) => setDestinatarioApellido(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Correo <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="ejemplo@gmail.com"
                                            value={destinatarioCorreo}
                                            onChange={(e) => setDestinatarioCorreo(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Telefono <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="315098745"
                                            value={destinatarioTelefono}
                                            onChange={(e) => setDestinatarioTelefono(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Información del paquete */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    Información del paquete
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Localidad <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            placeholder="Selecciona la localidad"
                                            defaultValue={localidad}
                                            onChange={(value) => setLocalidad(value)}
                                            options={opcionesTipoLocalidad.slice(0)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Dirección <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Ej: Calle 10 #31-92"
                                            value={direccionEntrega}
                                            onChange={(e) => setDireccionEntrega(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Tipo de paquete <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            placeholder="Tipo paquete"
                                            defaultValue={tipo}
                                            onChange={(value) => setTipo(value)}
                                            options={opcionesTipoPaquete.slice(0)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Valor declarado <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="0"
                                            type="number"
                                            value={valorDeclarado}
                                            onChange={(e) => setValorDeclarado(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Cantidad <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="0"
                                            type="number"
                                            value={cantidad}
                                            onChange={(e) => setCantidad(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dimensiones del paquete */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    Dimensiones del paquete
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Largo (cm) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="0"
                                            type="number"
                                            value={largo}
                                            onChange={(e) => setLargo(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Ancho (cm) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="0"
                                            type="number"
                                            value={ancho}
                                            onChange={(e) => setAncho(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Alto (cm) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="0"
                                            type="number"
                                            value={alto}
                                            onChange={(e) => setAlto(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                            Peso (kg) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="0"
                                            type="number"
                                            value={peso}
                                            onChange={(e) => setPeso(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
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

            {/* Modal de AsignarClientes */}
            {isModalClienteOpen && (
                <AsignarClientes
                    onClose={() => setIsModalClienteOpen(false)}
                    onSelectCliente={handleSelectCliente}
                />
            )}
        </>
    );
};