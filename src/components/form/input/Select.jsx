import { useState, useEffect } from "react";

const Select = ({
  options,
  placeholder = "Selecciona una opcion",
  onChange,
  className = "",
  defaultValue = "",
  disabledSelectOption
}) => {
  // Estado para el valor seleccionado, inicializado con defaultValue
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  // Actualiza selectedValue cuando defaultValue cambie
  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  // Si las opciones cambian y el valor seleccionado ya no existe, se restablece al defaultValue
  useEffect(() => {
    if (options.length > 0) {
      const exists = options.some(option => option.value === selectedValue);
      if (!exists && defaultValue) {
        setSelectedValue(defaultValue);
      }
    }
  }, [options, defaultValue, selectedValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value); // Notificar al componente padre
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800  ${selectedValue
          ? "text-gray-600 dark:text-white/90"
          : "text-gray-400 dark:text-gray-500"
        } ${className}`}
      value={selectedValue}
      onChange={handleChange}
    >
      {/* Opción de placeholder */}
      <option
        value=""
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        disabled={disabledSelectOption}
      >
        {placeholder}
      </option>
      {/* Mapeo de las opciones */}
      {options.map((option, index) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
