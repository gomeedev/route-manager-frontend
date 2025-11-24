import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true,
  isFullscreen = false,
  size = "default",
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "w-[90vw] max-w-md h-auto max-h-[90vh]",
    default: "w-[80vw] max-w-6xl h-[60vh] min-h-[400px] max-h-[90vh]",
  };

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : `relative ${sizeClasses[size] || sizeClasses.default} rounded-2xl bg-white shadow-2xl dark:bg-gray-800 dark:shadow-gray-900/50`;

  // ✨ Aquí usamos Portal. Este return ya NO se renderiza dentro del sidebar.
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999] animate-in fade-in-0 duration-300">
      {!isFullscreen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        ref={modalRef}
        className={`${contentClasses} ${className} transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4 flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/80 text-gray-500 backdrop-blur-sm hover:bg-gray-200 hover:text-gray-700"
          >
            ✕
          </button>
        )}

        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body // <-- Esto hace la magia
  );
};
