import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ value = "", onChange, placeholder = "Buscar..." }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    };

    const handleClose = () => {
        setIsExpanded(false);
        onChange("");
    };

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                if (isExpanded && !value) {
                    handleClose();
                }
            }
        };

        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isExpanded, value]);

    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") handleClose();
        };

        if (isExpanded) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isExpanded]);

    return (
        <div ref={containerRef} className="relative flex items-center">
            {/* Contenedor expandible */}
            <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'w-64' : 'w-10'
                }`}>

                {/* Input expandible */}
                <div className={`relative flex items-center transition-all duration-300 ${isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={`w-full pl-10 pr-10 py-2 text-sm bg-gray-100 dark:bg-gray-700 
                            border-0 rounded-lg placeholder-gray-500 text-gray-600 dark:text-gray-300
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isExpanded ? 'visible' : 'invisible'
                            }`}
                    />

                    {/* Icono de búsqueda dentro del input */}
                    {isExpanded && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                    )}

                    {/* Botón limpiar */}
                    {isExpanded && value && (
                        <button
                            onClick={() => onChange("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Botón de búsqueda - SOLO visible cuando NO está expandido */}
                {!isExpanded && (
                    <button
                        onClick={handleToggle}
                        className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400
                            rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;