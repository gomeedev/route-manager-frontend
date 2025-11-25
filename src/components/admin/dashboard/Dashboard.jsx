import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { API_URL } from '../../../global/config/api';
import ComponentCard from '../../common/ComponentCard';
import Loading from '../../common/Loading';

const Dashboard = () => {
  const [conductoresData, setConductoresData] = useState([]);
  const [paquetesData, setPaquetesData] = useState([]);
  const [vehiculosData, setVehiculosData] = useState([]);
  const [totalConductores, setTotalConductores] = useState(0);
  const [totalPaquetes, setTotalPaquetes] = useState(0);
  const [totalVehiculos, setTotalVehiculos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [conductoresRes, paquetesRes, vehiculosRes] = await Promise.all([
        axios.get(`${API_URL}/api/v1/drivers/`),
        axios.get(`${API_URL}/api/v1/paquetes/`),
        axios.get(`${API_URL}/api/v1/vehiculos/`)
      ]);

      // Totales
      setTotalConductores(conductoresRes.data.length);
      setTotalPaquetes(paquetesRes.data.length);
      setTotalVehiculos(vehiculosRes.data.length);

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
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const processByEstado = (data, estadoField, estados) => {
    return estados.map(estado => ({
      estado: estado,
      count: data.filter(item => item[estadoField] === estado).length
    }));
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Resumen general del sistema de gestión de rutas
        </p>
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

        {/* Fila 4-5: Espacio para Donas + Eficiencia/Vehículos */}
        {/* TODO: Agregar gráfica de donas y card complementaria */}

        {/* Fila 6: Gráfica de líneas - Ocupa todo el ancho */}
        {/* TODO: Agregar gráfica de líneas de rutas */}
      </div>
    </div>
  );
};

export default Dashboard;