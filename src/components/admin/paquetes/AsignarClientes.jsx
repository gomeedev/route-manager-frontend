import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

import { ArrowRight } from "lucide-react";

import { ClientsManagementService } from "../../../global/api/admin/ClientsManagementService";

import Table from "../../ui/table/Table";
import { Modal } from "../../ui/modal/Modal";
import Loading from "../../common/Loading";
import Badge from "../../ui/badge/Badge";




export const AsignarClientes = ({ onClose, onSelectCliente }) => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const obtenerClientes = async () => {
        setLoading(true);
        try {
            const response = await ClientsManagementService("");
            const sorted = response.sort((a, b) => {
                const paquetesComparison = (b.total_paquetes || 0) - (a.total_paquetes || 0);
                return paquetesComparison;
            });
            setClientes(sorted);
        } catch (error) {
            toast.error("No se pudieron cargar los clientes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerClientes();
    }, []);


    const filteredClientes = useMemo(() => {
        if (!search.trim()) return clientes;

        const searchLower = search.toLowerCase();

        return clientes.filter(cliente =>
            cliente.nombre?.toLowerCase().includes(searchLower) ||
            cliente.apellido?.toLowerCase().includes(searchLower) ||
            cliente.correo?.toLowerCase().includes(searchLower) ||
            cliente.telefono_movil?.toLowerCase().includes(searchLower)
        );
    }, [clientes, search]);

    const seleccionar = (cliente) => {
        onSelectCliente(cliente);
        onClose();
    };


    const columns = [
        {
            key: "id_cliente",
            label: "ID"
        },
        {
            key: "nombre",
            label: "Nombre"
        },
        {
            key: "apellido",
            label: "Apellido"
        },
        {
            key: "correo",
            label: "Correo"
        },
        {
            key: "telefono_movil",
            label: "Teléfono"
        },
    ];


    const actions = [
        {
            key: "seleccionar",
            label: "Seleccionar cliente",
            icon: <ArrowRight className="w-4 h-4" />,
            onClick: (item) => seleccionar(item),
            className: "hover:bg-success-50 text-success-600 hover:dark:bg-success-500/15 dark:text-success-500"
        },
    ];

    return (
        <Modal isOpen={true} onClose={onClose} showCloseButton className="p-8">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-6 mt-4">
                Seleccionar cliente para el paquete
            </h4>

            {loading ? (
                <div className="w-full flex justify-center py-10">
                    <Loading />
                </div>
            ) : (
                <Table
                    title={`Total de clientes: ${filteredClientes.length}`}
                    columns={columns}
                    data={filteredClientes}
                    actions={actions}
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Buscar clientes..."
                />
            )}
        </Modal>
    );
};