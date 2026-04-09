import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const LocationMap = ({ lat, lng, label }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "300px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;