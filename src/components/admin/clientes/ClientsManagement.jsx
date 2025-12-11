import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";

import { ClientsManagementService } from "../../../global/api/admin/ClientsManagementService";
import { CrearClientes } from "./CrearClientes";
import { EditarCliente } from "./EditarClientes";
import { EliminarCliente } from "./EliminarClientes";

import Loading from "../../common/Loading";
import Table from "../../ui/table/Table";
import Badge from "../../ui/badge/Badge";
import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";




export const ClientsManagement = () => {

    const [clients, setClients] = useState([]);
    const [selectedIdClient, setSelectedIdConductor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");


    const GetClientes = async () => {
        setLoading(true);
        try {
            const response = await ClientsManagementService("");
            const sorted = response.sort((a, b) => {
                const paquetesComparison = (b.total_paquetes || 0) - (a.total_paquetes || 0);
                return paquetesComparison;
            });
            setClients(sorted);
        } catch (error) {
            toast.error("No se pudieron cargar los clientes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetClientes();
    }, []);


    const filteredClients = useMemo(() => {
        if (!search.trim()) return clients;

        const searchLower = search.toLowerCase();

        return clients.filter(client =>
            client.nombre?.toLowerCase().includes(searchLower) ||
            client.apellido?.toLowerCase().includes(searchLower) ||
            client.correo?.toLowerCase().includes(searchLower) ||
            client.telefono_movil?.toLowerCase().includes(searchLower)
        );
    }, [clients, search]);


    const columns = [
        {
            key: "id_cliente",
            label: "id"
        },
        {
            key: "nombre",
            label: "Nombre",
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
            label: "Telefono"
        },
        {
            key: "direccion",
            label: "Dirección"
        },
        {
            key: "total_paquetes",
            label: "Total de pedidos",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 gap-4">
                        <Badge color="info">{item.total_paquetes}</Badge>
                    </span>
                </div>
            )
        },
    ];


    const actions = [
        {
            key: "editar",
            label: "Editar información",
            icon: <Edit className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdConductor(item.id_cliente);
                setIsModalOpen("editar");
            },
            className: "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        },
        {
            key: "Eliminar",
            label: "Eliminar cliente",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (item) => {
                setSelectedIdConductor(item.id_cliente);
                setIsModalOpen("eliminar");
            },
            className: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        }
    ];

    return (
        <>
            {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <>
                    <div className="mt-4 mb-8">
                        <AnimatedTitle text="Gestión de clientes" />
                        <AnimatedText text="Gestiona y organiza la información de tus clientes" />
                    </div>

                    <Table
                        title={`Total de clientes: ${clients.length}`}
                        columns={columns}
                        data={filteredClients}
                        actions={actions}
                        onAdd={() => setIsModalOpen(true)}
                        searchValue={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Buscar clientes"
                    />

                    {isModalOpen === true && (
                        <CrearClientes
                            onClose={() => setIsModalOpen(false)}
                            refreshTable={GetClientes}
                        />
                    )}
                </>
            )}

            {isModalOpen === "editar" && (
                <EditarCliente
                    clientId={selectedIdClient}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={GetClientes}
                />
            )}

            {isModalOpen === "eliminar" && (
                <EliminarCliente
                    clientId={selectedIdClient}
                    onClose={() => setIsModalOpen(false)}
                    refreshTable={GetClientes}
                />
            )}
        </>
    );
};
