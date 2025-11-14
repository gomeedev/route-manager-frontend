import { useState, useEffect } from "react";

import { toast } from "sonner";

import { DriversManagementService } from "../../../global/api/admin/DriversManagementService";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import Table from "../../ui/table/Table";
import { Modal } from "../../ui/modal/Modal";
import Badge from "../../ui/badge/Badge";
import Loading from "../../common/Loading";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";


export const DriversManagement = () => {

    const [drivers, setDrivers] = useState([])


    const GetConductores = async () => {
        try {

            const response = await DriversManagementService();
            setDrivers(response);

        } catch (error) {

            toast.error("No se puedieron cargar los conductores")
        }
    }

    useEffect(() => {
        GetConductores();
    }, []);


    const columns = [
        {
            key: "id_conductor",
            label: "id"
        },
        {
            key: "conductor_detalle",
            label: "Conductor",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <img
                        src={item.conductor_detalle.foto_perfil || fotoDefaultUrl}
                        alt="Conductor"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.conductor_detalle.nombre} {item.conductor_detalle.apellido}
                    </span>
                </div>
            )
        },
        {
            key: "conductor_detalle.tipo_documento",
            label: "Tipo documento",
        },
        {
            key: "conductor_detalle.correo",
            label: "Correo"
        },
        {
            key: "conductor_detalle.telefono_movil",
            label: "telefono"
        },
        {
            key: "estado",
            label: "Estado",
            render: (item) => {
                const colorMap = {
                    "Disponible": "success",
                    "en_ruta": "warning",
                    "no_disponible": "error",
                };
                return <Badge color={colorMap[item.estado] || "primary"}>{item.estado}</Badge>
            }
        }
    ]

    return (
        <>
        <div className="mt-4 mb-8">
            <AnimatedTitle text="Gestión de condutores" />
            <AnimatedText text="Gestiona el estado operativo de tus conductores en tiempo real" />

        </div>
            <Table
                title={`Total de conductores: ${drivers.length}`}
                columns={columns}
                data={drivers}
            />
        </>
    )
}