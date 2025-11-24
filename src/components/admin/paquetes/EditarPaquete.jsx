import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Edit } from "lucide-react";

import { GetDetallesPaquetesService, EditPackagesManagementService } from "../../../global/api/admin/PackagesManagementService";
import { ClientsManagementService } from "../../../global/api/admin/ClientsManagementService";

import Input from "../../form/input/InputField";
import Select from "../../form/input/Select";
import Loading from "../../common/Loading";
import { Modal } from "../../ui/modal/Modal";




export const EditarPaquete = ({ paqueteId, onClose, refreshTable }) => {
    const [clientes, setClientes] = useState([]);
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
    const [cliente, setCliente] = useState("");
    const [localidad, setLocalidad] = useState("");
    const [direccionEntrega, setDireccionEntrega] = useState("");
    const [loading, setLoading] = useState(true);


    const opcionesTipoLocalidad = [
        { value: 16, label: "Antonio Nariño" },
        { value: 13, label: "Barrios Unidos" },
        { value: 2, label: "Bosa" },
        { value: 3, label: "Chapinero" },
        { value: 20, label: "Ciudad Bolívar" },
        { value: 11, label: "Engativá" },
        { value: 10, label: "Fontibón" },
        { value: 9, label: "Kennedy" },
        { value: 18, label: "La Candelaria" },
        { value: 15, label: "Los Mártires" },
        { value: 17, label: "Puente Aranda" },
        { value: 19, label: "Rafael Uribe Uribe" },
        { value: 6, label: "San Cristóbal" },
        { value: 5, label: "Santa Fe" },
        { value: 12, label: "Suba" },
        { value: 21, label: "Sumapaz" },
        { value: 14, label: "Teusaquillo" },
        { value: 8, label: "Tunjuelito" },
        { value: 4, label: "Usaquén" },
        { value: 7, label: "Usme" }
    ];

    const opcionesTipoPaquete = [
        { value: "Grande", label: "Grande" },
        { value: "Mediano", label: "Mediano" },
        { value: "Pequeno", label: "Pequeño" },
        { value: "Refrigerado", label: "Refrigerado" },
        { value: "Fragil", label: "Frágil" },
    ];

    const getClientes = async () => {
        const res = await ClientsManagementService();
        setClientes(res.map(c => ({
            value: c.id_cliente,
            label: `${c.nombre} ${c.apellido}`
        })));
    };


    const cargarPaquete = async () => {
        try {
            const data = await GetDetallesPaquetesService(paqueteId);

            const p = data;

            // Cliente
            setCliente(p.cliente_detalle.id_cliente);

            // Localidad
            setLocalidad(p.localidad_detalle.id_localidad);

            // Tipo de paquete
            setTipo(p.tipo_paquete);

            // Datos del paquete
            setDireccionEntrega(p.direccion_entrega);
            setValorDeclarado(p.valor_declarado);
            setCantidad(p.cantidad);
            setLargo(p.largo);
            setAncho(p.ancho);
            setAlto(p.alto);
            setPeso(p.peso);

            // Destinatario
            setDestinatarioNombre(p.destinatario_nombre);
            setDestinatarioApellido(p.destinatario_apellido);
            setDestinatarioTelefono(p.destinatario_telefono);
            setDestinatarioCorreo(p.destinatario_correo);

        } catch (err) {

            console.error("Error al cargar paquete:", err);
            toast.error(err.response?.data?.message || "No se pudieron cargar los datos del paquete");
            onClose();

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        if (paqueteId) {
            getClientes();
            cargarPaquete();
        }
    }, [paqueteId]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            largo: Number(largo),
            ancho: Number(ancho),
            alto: Number(alto),
            peso: Number(peso),
            valor_declarado: valorDeclarado,
            cantidad: Number(cantidad),
            cliente: Number(cliente),
            localidad,
            tipo,
            direccion_entrega: direccionEntrega,
            destinatario_nombre: destinatarioNombre,
            destinatario_apellido: destinatarioApellido,
            destinatario_telefono: destinatarioTelefono,
            destinatario_correo: destinatarioCorreo
        };

        try {

            await EditPackagesManagementService(paqueteId, payload);

            toast.success("Paquete actualizado");
            refreshTable();
            onClose();

        } catch (err) {

            toast.error(err.response?.data?.details || "Error al actualizar el paquete");
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} showCloseButton={true}>
            {loading ? (
                <div className="w-full flex items-center justify-center py-10">
                    <Loading />
                </div>
            ) : (
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 pl-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Edit className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Editar Paquete
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">

                        {/* CLIENTE */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="block text-[15px] mb-2 text-gray-700 dark:text-gray-400">
                                Selecciona un cliente <span className="text-red-500">*</span>
                            </h4>
                            <Select
                                placeholder="Selecciona un cliente"
                                options={clientes}
                                defaultValue={cliente}
                                onChange={(value) => setCliente(value)}
                            />
                        </div>

                        {/* DESTINATARIO */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Información del destinatario
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[15px] mb-2">Nombre <span className="text-error-500">*</span></label>
                                    <Input value={destinatarioNombre} onChange={(e) => setDestinatarioNombre(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2">Apellido <span className="text-error-500">*</span></label>
                                    <Input value={destinatarioApellido} onChange={(e) => setDestinatarioApellido(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2">Correo <span className="text-error-500">*</span></label>
                                    <Input value={destinatarioCorreo} onChange={(e) => setDestinatarioCorreo(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2">Telefono <span className="text-error-500">*</span></label>
                                    <Input value={destinatarioTelefono} onChange={(e) => setDestinatarioTelefono(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* PAQUETE */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Información del paquete
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

                                <div>
                                    <label className="block text-[15px] mb-2">Localidad <span className="text-error-500">*</span></label>
                                    <Select
                                        placeholder="Selecciona una localidad"
                                        options={opcionesTipoLocalidad}
                                        defaultValue={localidad}
                                        onChange={(v) => setLocalidad(v)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2">Dirección <span className="text-error-500">*</span></label>
                                    <Input value={direccionEntrega} onChange={(e) => setDireccionEntrega(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-[15px] mb-2">Tipo <span className="text-error-500">*</span></label>
                                    <Select
                                        placeholder="Tipo paquete"
                                        options={opcionesTipoPaquete}
                                        defaultValue={tipo}
                                        onChange={(v) => setTipo(v)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2">Valor declarado <span className="text-error-500">*</span></label>
                                    <Input value={valorDeclarado} type="number" onChange={(e) => setValorDeclarado(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[15px] mb-2">Cantidad <span className="text-error-500">*</span></label>
                                    <Input value={cantidad} type="number" onChange={(e) => setCantidad(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* DIMENSIONES */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                Dimensiones del paquete
                            </h4>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-[15px] mb-2">Largo <span className="text-error-500">*</span></label>
                                    <Input type="number" value={largo} onChange={(e) => setLargo(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2">Ancho <span className="text-error-500">*</span></label>
                                    <Input type="number" value={ancho} onChange={(e) => setAncho(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2">Alto <span className="text-error-500">*</span></label>
                                    <Input type="number" value={alto} onChange={(e) => setAlto(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-[15px] mb-2">Peso <span className="text-error-500">*</span></label>
                                    <Input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* BOTONES */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700"
                                onClick={onClose}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="w-full px-4 py-3 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg"
                            >
                                Guardar cambios
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </Modal>
    );
};
