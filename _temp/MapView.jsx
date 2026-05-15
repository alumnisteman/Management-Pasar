import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import api from "../api";

export default function MapView() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const m = new maplibregl.Map({
      container: "map",
      style: "https://demotiles.maplibre.org/style.json",
      center: [127.4, 0.8],
      zoom: 12
    });

    setMap(m);

    return () => m.remove();
  }, []);

  useEffect(() => {
    if (!map) return;

    api.get("/vendors").then(res => {
      res.data.forEach(v => {
        new maplibregl.Marker({ color: v.status === 'illegal' ? 'red' : 'green' })
          .setLngLat([v.longitude, v.latitude])
          .addTo(map);
      });
    });
  }, [map]);

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
}
