"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { galleryPhotos } from "@/lib/data";
import type { GalleryPhoto } from "@/lib/data";

const HOME: [number, number] = [47.3636, 8.3856];

function homeIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:10px;height:10px;background:#333;border-radius:50%;border:2px solid rgba(50,50,50,0.4);box-shadow:0 0 0 5px rgba(50,50,50,0.1),0 2px 6px rgba(0,0,0,0.25);"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
}

function photoIcon(photo: GalleryPhoto) {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:44px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.3))"><div style="width:44px;height:35px;border:2px solid rgba(100,80,60,0.6);border-radius:5px;overflow:hidden;background:#e8e4de"><img src="${photo.thumb}" style="width:100%;height:100%;object-fit:cover"/></div><div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid rgba(100,80,60,0.6);margin:0 auto"></div></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -48],
  });
}

const popupStyle = {
  background: "#faf9f7",
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 11,
  color: "#333",
  minWidth: 120,
};

export default function MapClient() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({ iconRetinaUrl: "", iconUrl: "", shadowUrl: "" });
  }, []);

  return (
    <MapContainer
      center={[36, 22]}
      zoom={3}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      attributionControl={true}
      scrollWheelZoom={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={HOME} icon={homeIcon()}>
        <Popup closeButton={false}>
          <div style={popupStyle}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Rudolfstetten</div>
            <div style={{ color: "#c87847", fontSize: 10 }}>🏠 Home</div>
          </div>
        </Popup>
      </Marker>
      {galleryPhotos.map((photo) => (
        <Marker key={photo.id} position={[photo.lat, photo.lng]} icon={photoIcon(photo)}>
          <Popup closeButton={false}>
            <div style={popupStyle}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{photo.title}</div>
              <div style={{ color: "#c87847", fontSize: 10 }}>📍 {photo.location}</div>
              <div style={{ color: "#888", fontSize: 10, marginTop: 1 }}>{photo.date}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
