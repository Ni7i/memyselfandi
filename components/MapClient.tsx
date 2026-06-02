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
    html: `<div style="width:12px;height:12px;background:#e8e6e0;border-radius:50%;border:2.5px solid rgba(232,230,224,0.35);box-shadow:0 0 0 6px rgba(232,230,224,0.12),0 2px 8px rgba(0,0,0,0.6);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function photoIcon(photo: GalleryPhoto) {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:48px;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.5))"><div style="width:48px;height:38px;border:2.5px solid rgba(240,142,127,0.7);border-radius:6px;overflow:hidden;background:#1a1a1a"><img src="${photo.thumb}" style="width:100%;height:100%;object-fit:cover"/></div><div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid rgba(240,142,127,0.7);margin:0 auto"></div></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -52],
  });
}

const popupStyle = {
  background: "#17171a",
  border: "1px solid #25252a",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 11,
  color: "#e8e6e0",
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
      center={[46.8, 8.2]}
      zoom={7}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      attributionControl={true}
      scrollWheelZoom={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <Marker position={HOME} icon={homeIcon()}>
        <Popup closeButton={false}>
          <div style={popupStyle}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Rudolfstetten</div>
            <div style={{ color: "#f08e7f", fontSize: 10 }}>🏠 Home</div>
          </div>
        </Popup>
      </Marker>
      {galleryPhotos.map((photo) => (
        <Marker key={photo.id} position={[photo.lat, photo.lng]} icon={photoIcon(photo)}>
          <Popup closeButton={false}>
            <div style={popupStyle}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{photo.title}</div>
              <div style={{ color: "#f08e7f", fontSize: 10 }}>📍 {photo.location}</div>
              <div style={{ color: "#95918a", fontSize: 10, marginTop: 1 }}>{photo.date}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
