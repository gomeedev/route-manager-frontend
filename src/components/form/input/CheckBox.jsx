import React from "react";
import clsx from "clsx";

const Checkbox = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={clsx(
        "flex items-center space-x-3 cursor-pointer text-gray-800 dark:text-gray-200",
        { "cursor-not-allowed opacity-50": disabled }
      )}
    >
      <input
        id={id}
        type="checkbox"
        className={clsx(
          "w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-600",
          "dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:checked:border-blue-600",
          "focus:ring-offset-0 focus:outline-none",
          className
        )}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
};

export default Checkbox;
