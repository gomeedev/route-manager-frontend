import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { GetNotifications } from "../../global/api/NovedadesService";

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
    
      setLoading(true);

      try {

        const novedades = await GetNotifications();
        console.log(novedades)
        setNotifications(novedades || []);

      } catch (error) {

        console.error("Error al obtener las notificaciones:", error);

      } finally {

        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      {/* Botón campana */}
      <button
        className="dropdown-toggle relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <NotificationsIcon className="text-gray-700 dark:text-gray-300" />
        {notifications.some((n) => !n.leida) && (
          <span className="absolute top-2 right-2 block h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-80">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-gray-800 dark:text-white font-semibold text-sm">
            Notificaciones
          </h3>
          <DropdownItem
            tag="a"
            to="/admin/novedades"
            className="text-blue-600 text-xs hover:underline"
          >
            Ver todas
          </DropdownItem>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <p className="p-3 text-sm text-gray-500">Cargando...</p>
          ) : notifications.length > 0 ? (
            notifications.map((novedad) => (
              <DropdownItem
                key={novedad.id_novedad}
                className={`!px-3 !py-2 border-b border-gray-100 dark:border-gray-700 text-sm ${
                  !novedad.leida ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <p className="text-gray-800 dark:text-gray-200">
                  <span className="font-medium">{novedad.conductor_nombre}</span> —{" "}
                  {novedad.descripcion}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(novedad.fecha_novedad).toLocaleString()}
                </p>
              </DropdownItem>
            ))
          ) : (
            <p className="p-3 text-sm text-gray-500">Sin notificaciones nuevas</p>
          )}
        </div>
      </Dropdown>
    </div>
  );
};
