"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
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
        width:48px;
        cursor:pointer;
        filter: drop-shadow(0 3px 8px rgba(0,0,0,0.35));
      ">
        <div style="
          width:48px; height:38px;
          border:2.5px solid #fff;
          border-radius:6px; overflow:hidden;
          background:#f0e8dc;
          box-shadow: 0 2px 6px rgba(80,50,20,0.3);
        ">
          <img src="${photo.thumb}" style="width:100%;height:100%;object-fit:cover;" />
        </div>
        <div style="
          width:0; height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:7px solid #fff;
          margin:0 auto;
        "></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -52],
  });
}

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
      attributionControl={false}
      scrollWheelZoom={true}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />
      {galleryPhotos.map((photo) => (
        <Marker key={photo.id} position={[photo.lat, photo.lng]} icon={photoIcon(photo)}>
          <Popup closeButton={false}>
            <div style={{
              background: "#fffef9",
              border: "1px solid #e4d8c8",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 11,
              color: "#2a1e12",
              minWidth: 120,
              boxShadow: "0 2px 12px rgba(80,50,20,0.15)",
            }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{photo.title}</div>
              <div style={{ color: "#9a8070", fontSize: 10 }}>📍 {photo.location}</div>
              <div style={{ color: "#b4a090", fontSize: 10, marginTop: 1 }}>{photo.date}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
