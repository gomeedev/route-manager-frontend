import { useMap } from "react-leaflet";
import { Plus, Minus } from "lucide-react";

export const CustomZoomControl = () => {
    const map = useMap();

    const handleZoomIn = () => {
        map.zoomIn();
    };

    const handleZoomOut = () => {
        map.zoomOut();
    };

    return (
        <div
            style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "12px",
                overflow: "hidden",
            }}
        >
            <button
                onClick={handleZoomIn}
                style={{
                    width: "44px",
                    height: "44px",
                    background: "white",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2563eb",
                    fontSize: "20px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    borderBottom: "1px solid #e5e7eb",
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "#f3f4f6";
                    e.target.style.color = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "white";
                    e.target.style.color = "#2563eb";
                }}
            >
                <Plus size={20} strokeWidth={3} />
            </button>

            <button
                onClick={handleZoomOut}
                style={{
                    width: "44px",
                    height: "44px",
                    background: "white",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2563eb",
                    fontSize: "20px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "#f3f4f6";
                    e.target.style.color = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "white";
                    e.target.style.color = "#2563eb";
                }}
            >
                <Minus size={20} strokeWidth={3} />
            </button>
        </div>
    );
};