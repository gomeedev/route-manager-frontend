import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, Edit, ArrowRight, Trash2 } from "lucide-react";

import { ClientsManagementService } from "../../../global/api/admin/ClientsManagementService";
import { CrearClientes } from "./CrearClientes";
import { EditarCliente } from "./EditarClientes";


import Loading from "../../common/Loading";
import Table from "../../ui/table/Table";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";
import { EliminarCliente } from "./EliminarClientes";




export const ClientsManagement = () => {

    const [clients, setClients] = useState([])
    const [selectedIdClient, setSelectedIdConductor] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)


    const GetClientes = async () => {

        setLoading(true)

        try {

            const response = await ClientsManagementService();
            setClients(response);

        } catch (error) {

            toast.error("No se puedieron cargar los clientes")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetClientes();
    }, []);


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
    ]


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
                <div className="w-full h-screen flex items-center justify-center" >
                    <Loading />
                </div >
            ) :
                <>
                    <div className="mt-4 mb-8">
                        <AnimatedTitle text="Gestión de clientes" />
                        <AnimatedText text="Gestiona y organiza la información de tus clientes" />
                    </div>

                    <Table
                        title={`Total de clientes: ${clients.length}`}
                        columns={columns}
                        data={clients}
                        actions={actions}
                        onAdd={() => setIsModalOpen(true)}
                    />


                    {isModalOpen === true && (
                        <CrearClientes
                            onClose={() => setIsModalOpen(false)}
                            refreshTable={GetClientes}
                        />
                    )}
                </>
            }


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
    )
}
