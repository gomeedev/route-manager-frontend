export const SimulacionPanel = ({ paquete, onSubmit }) => {

    const handleEntregado = () => {
        onSubmit(paquete.id_paquete, "Entregado", null);
    };

    const handleFallido = () => {
        onSubmit(paquete.id_paquete, "Fallido", null);
    };

    return (
        <div
            style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "15px",
                background: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                zIndex: 9999,
                minWidth: "280px"
            }}
        >
            <h4>Entrega del paquete #{paquete.id_paquete}</h4>
            <p><b>Cliente:</b> {paquete.cliente_detalle?.nombre || "N/A"}</p>
            <p><b>Dirección:</b> {paquete.direccion_entrega}</p>

            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button
                    onClick={handleEntregado}
                    style={{
                        flex: 1,
                        padding: "8px",
                        background: "#16a34a",
                        color: "white",
                        borderRadius: "6px"
                    }}
                >
                    Entregado
                </button>

                <button
                    onClick={handleFallido}
                    style={{
                        flex: 1,
                        padding: "8px",
                        background: "#dc2626",
                        color: "white",
                        borderRadius: "6px"
                    }}
                >
                    Fallido
                </button>
            </div>
        </div>
    );
};
