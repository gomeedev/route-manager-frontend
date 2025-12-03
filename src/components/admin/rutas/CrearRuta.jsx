import { useState } from "react";

import { PostRoutesService } from "../../../global/api/admin/RoutesManagementService";

import { toast } from "sonner";
import { Modal } from "../../ui/modal/Modal";



export const CrearRuta = ({ routeId, onClose, refreshTable }) => {

    const [loading, setLoading] = useState(false)


    const handleCreate = async () => {
        setLoading(true);

        try {

            await PostRoutesService(routeId)
            toast.success("Ruta creada correctamente");

            refreshTable();
            onClose();

        } catch (error) {

            toast.error(error.response?.data?.details || "No se pudo eliminar el vehículo");

        } finally {
            setLoading(false);

        }
    }

    return (
        <Modal isOpen={true} onClose={onClose} showCloseButton={true} size="sm">
            <div className="flex flex-col items-center justify-center text-center space-y-6 p-6">
                <p className="text-[16px] font-medium text-gray-800 dark:text-gray-200">
                    ¿Estas seguro que deseas crear una ruta?
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="w-[150px] px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-[150px] px-4 py-3 rounded-lgfont-medium bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </Modal>
    )

}