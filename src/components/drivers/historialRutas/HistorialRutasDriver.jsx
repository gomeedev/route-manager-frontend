import { useEffect, useState } from "react";
import { getHistorialRutasDriver } from "../../../global/api/drivers/historialRutas";
import { getConductorByUserId } from "../../../global/api/drivers/rutaActual";
import Loading from "../../common/Loading";

export const HistorialRutasDriver = () => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarHistorial = async () => {
        try {
            setLoading(true);
            
            // Mismo patrón que usas en ModalRutaActual
            const user = JSON.parse(localStorage.getItem("user"));
            const conductor = await getConductorByUserId(user.id_usuario);
            const rutas = await getHistorialRutasDriver(conductor.id_conductor);
            
            setHistorial(rutas);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarHistorial();
    }, []);

    if (loading) return <Loading />;

    if (historial.length === 0) {
        return <div>No tienes rutas completadas aún</div>;
    }

    return (
        <div>
            <h2>Mi Historial de Rutas</h2>
            {historial.map((ruta) => (
                <div key={ruta.id_ruta}>
                    <h3>{ruta.codigo_manifiesto}</h3>
                    <p>Estado: {ruta.estado}</p>
                    <p>Paquetes entregados: {ruta.paquetes_entregados}</p>
                    <p>Paquetes fallidos: {ruta.paquetes_fallidos}</p>
                    <p>Fecha: {new Date(ruta.fecha_fin).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};