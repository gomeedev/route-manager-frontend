import React, { useState, useEffect } from 'react';

import { API_URL } from '../../../global/config/api';
import axios from 'axios';

import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import AnimatedTitle from "../../ui/animation/AnimatedTitle";
import AnimatedText from "../../ui/animation/AnimatedText";

import ComponentCard from '../../common/ComponentCard';
import Loading from '../../common/Loading';




const Dashboard = () => {

    const [conductoresData, setConductoresData] = useState([]);
    const [paquetesData, setPaquetesData] = useState([]);
    const [vehiculosData, setVehiculosData] = useState([]);
    const [rutasData, setRutasData] = useState([]);
    const [totalConductores, setTotalConductores] = useState(0);
    const [totalPaquetes, setTotalPaquetes] = useState(0);
    const [totalVehiculos, setTotalVehiculos] = useState(0);

    const [eficiencia, setEficiencia] = useState(0);
    const [entregadosCount, setEntregadosCount] = useState(0);
    const [fallidosCount, setFallidosCount] = useState(0);

    const [loading, setLoading] = useState(true);


    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [conductoresRes, paquetesRes, vehiculosRes, rutasRes] = await Promise.all([
                axios.get(`${API_URL}/api/v1/drivers/`),
                axios.get(`${API_URL}/api/v1/paquetes/`),
                axios.get(`${API_URL}/api/v1/vehiculos/`),
                axios.get(`${API_URL}/api/v1/rutas`)
            ]);

            // Totales
            setTotalConductores(conductoresRes.data.length);
            setTotalPaquetes(paquetesRes.data.length);
            setTotalVehiculos(vehiculosRes.data.length);


            // Calcular eficiencia
            const entregados = paquetesRes.data.filter(p => p.estado_paquete === 'Entregado').length;
            const fallidos = paquetesRes.data.filter(p => p.estado_paquete === 'Fallido').length;

            setEntregadosCount(entregados);
            setFallidosCount(fallidos);

            const totalProcesados = entregados + fallidos;

            const eficienciaCalc = totalProcesados > 0
                ? ((entregados / totalProcesados) * 100).toFixed(1)
                : 0;

            setEficiencia(eficienciaCalc);


            // Procesar por estados
            setConductoresData(processByEstado(conductoresRes.data, 'estado', [
                'Disponible', 'Asignado', 'En ruta', 'No disponible'
            ]));

            setPaquetesData(processByEstado(paquetesRes.data, 'estado_paquete', [
                'Pendiente', 'Asignado', 'En ruta', 'Entregado', 'Fallido'
            ]));

            setVehiculosData(processByEstado(vehiculosRes.data, 'estado', [
                'Disponible', 'Asignado', 'En ruta', 'No disponible'
            ]));

            // Filtrar y procesar rutas
            const estadosPermitidos = ["Completada", "Fallida"];
            const rutasFiltradas = rutasRes.data.filter(ruta =>
                estadosPermitidos.includes(ruta.estado)
            );
            setRutasData(processRutasLast7Days(rutasFiltradas));
        } catch (error) {
            console.log(error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);


    const processByEstado = (data, estadoField, estados) => {
        return estados.map(estado => ({
            estado: estado,
            count: data.filter(item => item[estadoField] === estado).length
        }));
    };

    const processRutasLast7Days = (rutas) => {
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
            const dateStr = date.toISOString().split('T')[0];

            const completadas = rutas.filter(ruta => {
                if (!ruta.fecha_fin) return false;
                const rutaDate = new Date(ruta.fecha_fin).toISOString().split('T')[0];
                return rutaDate === dateStr && ruta.estado === 'Completada';
            }).length;

            const fallidas = rutas.filter(ruta => {
                if (!ruta.fecha_fin) return false;
                const rutaDate = new Date(ruta.fecha_fin).toISOString().split('T')[0];
                return rutaDate === dateStr && ruta.estado === 'Fallida';
            }).length;

            last7Days.push({
                day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                completadas: completadas,
                fallidas: fallidas
            });
        }

        return last7Days;
    };

    const COLORS = {
        'Pendiente': '#f59e0b',
        'Asignado': '#3b82f6',
        'En ruta': '#8b5cf6',
        'Entregado': '#10b981',
        'Fallido': '#ef4444'
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-800 dark:text-white font-medium">{payload[0].payload.estado}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{`${payload[0].value} registros`}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center" >
                <Loading />
            </div >
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="mt-4 mb-12">
                <AnimatedTitle text="Bienvenido Administrador" />
                <AnimatedText text="Visualiza el rendimiento de tu empresa de forma rapida e intuitiva." />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Fila 1-3: Cards de Barras por Estado */}
                <ComponentCard
                    title="Total Conductores"
                    desc={`${totalConductores} conductores registrados`}
                >
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={conductoresData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="estado"
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ComponentCard>

                <ComponentCard
                    title="Total Paquetes"
                    desc={`${totalPaquetes} paquetes registrados`}
                >
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={paquetesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="estado"
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ComponentCard>

                <ComponentCard
                    title="Total Vehículos"
                    desc={`${totalVehiculos} vehículos registrados`}
                >
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={vehiculosData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="estado"
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ComponentCard>

                {/* Fila 4-5: Donas + Eficiencia */}
                <ComponentCard
                    title="Estado de Paquetes"
                    desc="Distribución por estado"
                    className="lg:col-span-2"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart className='mt-4'>
                            <Pie
                                data={paquetesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ estado, percent, count }) => count > 0 ? `${estado} ${(percent * 100).toFixed(0)}%` : ""}
                                innerRadius={40}
                                paddingAngle={4}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="estado"
                            >
                                {paquetesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.estado]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign='bottom'
                                formatter={(value, entry) => `${value}: ${entry.payload.count}`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ComponentCard>

                <ComponentCard
                    title="Eficiencia de Entregas"
                    desc="Porcentaje de paquetes entregados exitosamente"
                >
                    <div className="flex flex-col items-center justify-center h-[300px]">
                        <div className="text-7xl font-bold text-brand-500 dark:text-brand-400">
                            {eficiencia}%
                        </div>
                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <p className="pr-6 pl-6 text-center">
                                {entregadosCount} de {entregadosCount + fallidosCount} paquetes procesados han sido entregados con éxito.
                            </p>
                        </div>
                    </div>
                </ComponentCard>

                {/* Fila 6: Gráfica de líneas - Ocupa todo el ancho */}
                <ComponentCard
                    title="Tendencia de Rutas"
                    desc="Rutas completadas vs fallidas en los últimos 7 días"
                    className="lg:col-span-3"
                >
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={rutasData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="day"
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="line"
                            />
                            <Line
                                type="monotone"
                                dataKey="completadas"
                                stroke="#10b981"
                                strokeWidth={1}
                                name="Completadas"
                                dot={{ fill: '#10b981', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="fallidas"
                                stroke="#ef4444"
                                strokeWidth={1}
                                name="Fallidas"
                                dot={{ fill: '#ef4444', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ComponentCard>
            </div>
        </div>
    );
};

export default Dashboard;
