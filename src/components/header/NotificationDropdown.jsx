import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../common/Loading";
import { GetNotifications, MarcarNovedad } from "../../global/api/NovedadesService";

import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { toast } from "sonner";



export const NotificationDropdown = () => {
  const [novedades, setNovedades] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);


  useEffect(() => {
    const obtenerNovedades = async () => {
      setCargando(true);
      try {
        const datos = await GetNotifications();
        setNovedades(datos || []);
      } catch (error) {
        console.error("Error al obtener las novedades:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerNovedades();
  }, []);


  const marcarComoLeida = async (id_novedad) => {
    try {
      const novedadActualizada = await MarcarNovedad(id_novedad, { leida: true });

      // Actualizar estado local sin recargar
      setNovedades((prevNovedades) =>
        prevNovedades.map((n) =>
          n.id_novedad === id_novedad ? novedadActualizada : n
        )
      );
    } catch (error) {
      
      console.error("Error al marcar la novedad como leída:", error);
      toast.error("No se pudo marcar como leida")

    }
  };

  // Calcular notificaciones no leídas
  const notificacionesNoLeidas = novedades.filter((n) => !n.leida).length;
  const hayNotificaciones = novedades.length > 0;

  return (
    <div className="relative">

      <button
        className="relative flex items-center justify-center text-gray-500 transition-all duration-200 rounded-lg h-10 w-10 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        onClick={() => setAbierto(!abierto)}
        aria-label="Notificaciones"
      >
        {/* Indicador de notificaciones no leídas con animación */}
        {notificacionesNoLeidas > 0 && (
          <span className="absolute -right-1 -top-1 z-10 min-w-[20px] h-5 px-1 flex items-center justify-center text-xs font-medium text-white bg-orange-500 rounded-full">
            {notificacionesNoLeidas > 99 ? "99+" : notificacionesNoLeidas}
            <span className="absolute inline-flex w-full h-full bg-orange-500 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}

        {/* Icono de campana outline (transparente con bordes) */}
        <svg
          className="fill-current transition-transform duration-200 hover:scale-110"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>


      <Dropdown
        isOpen={abierto}
        onClose={() => setAbierto(false)}
        className="absolute mt-3 flex h-[480px] flex-col rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 z-50
          right-1/2 translate-x-1/2 w-[calc(100vw-2rem)] max-w-[350px]
          sm:right-0 sm:translate-x-0 sm:w-[380px] sm:max-w-none
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notificaciones
            </h5>
            {notificacionesNoLeidas > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-medium text-white bg-orange-500 rounded-full">
                {notificacionesNoLeidas}
              </span>
            )}
          </div>

          <button
            onClick={() => setAbierto(false)}
            className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            aria-label="Cerrar notificaciones"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Lista de notificaciones */}
        <div className="flex-1 overflow-y-auto px-2">
          {cargando ? (
            <Loading />
          ) : hayNotificaciones ? (
            <ul className="space-y-1 py-2">
              {novedades.map((novedad) => {
                return (
                  <li key={novedad.id_novedad}>
                    <DropdownItem
                      onClick={() => marcarComoLeida(novedad.id_novedad)}
                      className={`
                        rounded-xl border-b border-gray-50 p-4 transition-all duration-200 
                        dark:border-gray-800 cursor-pointer
                        ${!novedad.leida
                          ? "bg-blue-50/50 hover:bg-blue-50/70 dark:bg-blue-900/10 dark:hover:bg-blue-900/15"
                          : "bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                        }
                      `}
                    >
                      {/* Primera fila: Nombre conductor y tipo */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {novedad.conductor_nombre}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {novedad.tipo}
                        </span>
                      </div>

                      {/* Segunda fila: Descripción */}
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {novedad.descripcion}
                      </p>

                      {/* Tercera fila: Imagen o texto si no hay */}
                      {novedad.imagen ? (
                        <img
                          src={novedad.imagen}
                          alt="Comprobante"
                          className="mb-2 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-h-40 object-cover"
                        />
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-2">
                          No adjuntó imagen
                        </p>
                      )}

                      {/* Cuarta fila: Fecha y estado */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(novedad.fecha_novedad).toLocaleString()}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${!novedad.leida
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                            : "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                            }`}
                        >
                          {novedad.leida ? "Leído" : "No leído"}
                        </span>
                      </div>
                    </DropdownItem>
                  </li>
                );
              })}
            </ul>
          ) : (
            // Estado vacío elegante
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <path
                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.73 21a2 2 0 0 1-3.46 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No hay notificaciones
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Te notificaremos cuando algo importante suceda
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {hayNotificaciones && (
          <div className="p-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Link to="/admin/novedades" className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600">
              Ver historial de novedades
            </Link>
          </div>
        )}
      </Dropdown>
    </div>
  );
};