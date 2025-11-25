import { Polyline } from "react-leaflet";

export const PolylineRuta = ({ geometry }) => {
    if (!geometry || geometry.length === 0) return null;

    return (
        <Polyline
            positions={geometry}
            pathOptions={{
                weight: 5,
                opacity: 0.8,
            }}
        />
    );
};
