import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "../../ui/modal/Modal";
import { DeleteClientsManagementService } from "../../../global/api/admin/ClientsManagementService";

export const EliminarCliente = ({ clientId, onClose, refreshTable }) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            await DeleteClientsManagementService(clientId);

            toast.success("Cliente eliminado correctamente");

            refreshTable();  
            onClose();      

        } catch (error) {
            toast.error(error.response?.data?.error || "No se pudo eliminar el cliente");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} showCloseButton={true} size="sm">
            <div className="flex flex-col items-center justify-center text-center space-y-6 p-6">
                <p className="text-[16px] font-medium text-gray-800 dark:text-gray-200">
                    ¿Estás seguro de que deseas eliminar este cliente?
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="w-[150px] px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-[150px] px-4 py-3 rounded-lg bg-error-500 text-white hover:bg-error-600 disabled:opacity-50"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </Modal>
    );
};
