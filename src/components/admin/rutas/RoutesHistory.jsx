import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Eye, Download } from "lucide-react";

import { fotoDefaultUrl } from "../../../global/supabase/storageService";

import { GetRoutesHistoryService, ExportarPdfRutaService } from "../../../global/api/admin/RoutesManagementService";

import Loading from "../../common/Loading";
import Table from "../../ui/table/Table";
import EstadoFilter from "../../../hooks/EstadoFilter";
import Badge from "../../ui/badge/Badge";

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";




export const Routeshistory = () => {

    const [routes, setRoutes] = useState([])
    const [loading, setLoading] = useState(false)
    const [filtroEstado, setFiltroEstado] = useState("");


    const ESTADOS_ROUTES = ["Completada", "Fallida"];

    const routesFiltradas = filtroEstado === ""
        ? routes
        : routes.filter(r => r.estado === filtroEstado);


    const GetRoutes = async () => {

        setLoading(true)

        try {

            const response = await GetRoutesHistoryService();
            
            const ordenadas = response.sort((a, b) => {
                const fechaA = a.fecha_fin ? new Date(a.fecha_fin) : null;
                const fechaB = b.fecha_fin ? new Date(b.fecha_fin) : null;

                // Si una tiene fecha_fin y la otra no
                if (fechaA && !fechaB) return -1; // A va primero
                if (!fechaA && fechaB) return 1;  // B va primero

                // Si ninguna tiene fecha_fin, mantener orden
                if (!fechaA && !fechaB) return 0;

                // Ambas tienen fecha: ordenar desc (más reciente primero)
                return fechaB - fechaA;
            });

            setRoutes(ordenadas);

        } catch (error) {

            toast.error("No se puedieron cargar las rutas")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetRoutes()
    }, [])


    const handleView = async (id_ruta) => {
        try {
            const response = await ExportarPdfRutaService(id_ruta);

            const blob = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(blob);

            window.open(fileURL, "_blank");
        } catch (error) {
            toast.error("No se pudo abrir el PDF");
        }
    };


    const handleDownload = async (id_ruta) => {
        try {
            const response = await ExportarPdfRutaService(id_ruta);

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `reporte-ruta_${id_ruta}.pdf`;
            link.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            toast.error("No se pudo descargar el PDF");
        }
    };




    const columns = [
        {
            key: "codigo_manifiesto",
            label: "Manifiesto"
        },
        {
            key: "conductor",
            label: "Conductor",
            render: (item) => {
                const conductor = item.conductor_detalle?.conductor_detalle;

                return (
                    <div className="flex items-center gap-3">
                        <img src={conductor?.foto_perfil || fotoDefaultUrl}
                            alt="Conductor"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 gap-4">
                            {conductor
                                ? `${conductor?.nombre} ${conductor?.apellido}`
                                : <span className="text-sm text-gray-500 dark:text-gray-400"><i>Sin asignar</i></span>}
                        </span>
                    </div>
                );
            }
        },
        {
            key: "vehiculo",
            label: "Vehiculo",
            render: (item) => {
                const vehiculo = item.vehiculo_usado_detalle || item.conductor_detalle?.vehiculo_detalle;

                return (
                    <div className="flex items-center gap-3">
                        {vehiculo ? (
                            <>
                                <img
                                    src={vehiculo.imagen || fotoDefaultUrl}
                                    alt="vehiculo"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {vehiculo.tipo}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {vehiculo.placa}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                <i>Sin asignar</i>
                            </span>
                        )}
                    </div>
                );
            }
        },

        {
            key: "paquetes",
            label: "Paquetes",
            render: (item) => (
                <div className="flex items-center gap-4">
                    <Badge color="info">{item.paquetes_asignados.length}</Badge>
                </div>
            )
        },
        {
            key: "fecha_inicio",
            label: "Fecha inicio",
            render: (item) => {
                const fecha = new Date(item.fecha_inicio);
                return (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {
                            new Intl.DateTimeFormat("es-CO", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour: "numeric",
                                minute: "numeric"
                            }).format(fecha)
                        }
                    </span>
                )
            }
        },
        {
            key: "fecha_fin",
            label: "Fecha fin",
            render: (item) => {
                if (!item.fecha_fin) {
                    return (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            <i>Pendiente</i>
                        </span>
                    );
                }

                const fecha = new Date(item.fecha_fin);

                return (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {
                            new Intl.DateTimeFormat("es-CO", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour: "numeric",
                                minute: "numeric"
                            }).format(fecha)
                        }
                    </span>
                );
            }
        },
        {
            key: "estado",
            label: "Estado",
            render: (item) => {
                const colorMap = {
                    "Pendiente": "warning",
                    "Asignada": "primary",
                    "En ruta": "info",
                    "Completada": "success",
                    "Fallida": "error",
                };
                return <Badge color={colorMap[item.estado] || "primary"}>{item.estado}</Badge>
            }
        }

    ]


    const actions = [
        {
            key: "ver",
            label: "Ver reporte",
            icon: <Eye className="w-4 h-4" />,
            onClick: (item) => handleView(item.id_ruta)
        },
        {
            key: "descargar",
            label: "Descargar reporte",
            icon: <Download className="w-4 h-4" />,
            onClick: (item) => handleDownload(item.id_ruta)
        }
    ]



    return (
        <>
            {loading ? (
                <div className="w-full h-screen flex items-center justify-center" >
                    <Loading />
                </div >
            ) :
                <>
                    <div className="mt-4 mb-8">
                        <AnimatedTitle text="Historial de rutas" />
                        <AnimatedText text="Visualiza y genera reportes del historial de entregas de tus conductores" />
                    </div>

                    <Table
                        title={`Total de rutas: ${routesFiltradas.length}`}
                        columns={columns}
                        data={routesFiltradas}
                        actions={actions}
                        headerActions={
                            <EstadoFilter
                                value={filtroEstado}
                                onChange={setFiltroEstado}
                                estados={ESTADOS_ROUTES}
                                entityLabel="rutas"
                                showLabel={true}
                            />
                        }
                    />
                </>
            }
        </>
    )

}