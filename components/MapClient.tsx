"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { galleryPhotos } from "@/lib/data";
import type { GalleryPhoto } from "@/lib/data";

function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    const obs = new ResizeObserver(() => map.invalidateSize());
    obs.observe(map.getContainer());
    return () => { clearTimeout(t); obs.disconnect(); };
  }, [map]);
  return null;
}

const HOME: [number, number] = [47.3636, 8.3856];

function homeIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:10px;height:10px;background:#f08e7f;border-radius:50%;border:2px solid rgba(240,142,127,0.4);box-shadow:0 0 0 5px rgba(240,142,127,0.15),0 2px 6px rgba(0,0,0,0.5);"></div>`,
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
  background: "#17171a",
  border: "1px solid #3e3e48",
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
      center={[36, 22]}
      zoom={3}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      attributionControl={true}
      scrollWheelZoom={false}
    >
      <MapInvalidator />
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
              <div style={{ color: "#5f5c56", fontSize: 10, marginTop: 1 }}>{photo.date}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
