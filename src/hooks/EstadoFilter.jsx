// components/common/EstadoFilter.jsx
import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export default function EstadoFilter({
    value = "",              // "" => Todos; o una cadena exacta como "Pendiente"
    onChange,                // function(newValue)
    estados = [],            // ej: ["Pendiente","Asignado","En ruta","Entregado","Fallido"]
    entityLabel = "paquetes",// usado en el tooltip: "Filtrar paquetes"
    showLabel = true,        // si quieres mostrar texto al lado del icono (puedes false)
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // cerrar al click fuera
    useEffect(() => {
        const onDoc = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    return (
        <div ref={ref} className="relative inline-flex items-center">
            <button
                title={`Filtrar ${entityLabel}`}
                onClick={() => setOpen((s) => !s)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
                <MoreHorizontal className="w-4 h-4" />
                {showLabel && <span className="text-sm">{value === "" ? "Todos" : value}</span>}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow z-50 mt-[180px]">
                    {/* Opción TODOS */}
                    <button
                        onClick={() => { onChange(""); setOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${value === "" ? "font-medium bg-gray-100 dark:bg-gray-700" : "text-gray-700 dark:text-gray-300"}`}
                    >
                        Todos
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                    {estados.map((est) => (
                        <button
                            key={est}
                            onClick={() => { onChange(est); setOpen(false); }}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${value === est ? "font-medium bg-gray-100 dark:bg-gray-700" : "text-gray-700 dark:text-gray-300"}`}
                        >
                            {est}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
