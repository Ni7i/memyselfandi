"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { galleryPhotos } from "@/lib/data";
import type { GalleryPhoto } from "@/lib/data";

function photoIcon(photo: GalleryPhoto) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        position:relative;
        width:44px;
        cursor:pointer;
        filter: drop-shadow(0 3px 8px rgba(0,0,0,0.8));
      ">
        <div style="
          width:44px; height:34px;
          border:2px solid rgba(255,255,255,0.25);
          border-radius:5px; overflow:hidden;
          background:#0d0d0d;
        ">
          <img src="${photo.thumb}" style="width:100%;height:100%;object-fit:cover;" />
        </div>
        <div style="
          width:0; height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:6px solid rgba(255,255,255,0.25);
          margin:0 auto;
        "></div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -48],
  });
}

export default function MapClient() {
  useEffect(() => {
    // Fix leaflet icon paths in Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "",
      iconUrl: "",
      shadowUrl: "",
    });
  }, []);

  return (
    <MapContainer
      center={[48.8, 10.5]}
      zoom={5}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />
      {galleryPhotos.map((photo) => (
        <Marker
          key={photo.id}
          position={[photo.lat, photo.lng]}
          icon={photoIcon(photo)}
        >
          <Popup
            closeButton={false}
          >
            <div style={{
              background: "#141414",
              border: "1px solid #252525",
              borderRadius: 8,
              padding: "8px 10px",
              fontSize: 11,
              color: "#d4d4d4",
              minWidth: 120,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{photo.title}</div>
              <div style={{ color: "#666", fontSize: 10 }}>{photo.location}</div>
              <div style={{ color: "#444", fontSize: 10, marginTop: 2 }}>{photo.date}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
