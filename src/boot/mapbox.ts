import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
console.log(
  'import.meta.env.MAPBOX_ACCESS_TOKEN',
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
);
