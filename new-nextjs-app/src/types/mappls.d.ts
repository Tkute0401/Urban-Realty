// TypeScript declarations for Mappls Web SDK

declare global {
  interface Window {
    Mappls: {
      Map: new (options: MapplsMapOptions) => MapplsMap;
      Marker: new (options: MapplsMarkerOptions) => MapplsMarker;
      LngLatBounds: new () => MapplsLngLatBounds;
    };
    initMap: () => void;
  }
}

interface MapplsMapOptions {
  container: HTMLElement;
  style: string;
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  interactive?: boolean;
  bearing?: number;
  pitch?: number;
  attributionControl?: boolean;
  logoPosition?: string;
}

interface MapplsMap {
  on(event: string, callback: (e?: any) => void): void;
  fitBounds(bounds: MapplsLngLatBounds, options?: { padding?: number }): void;
  remove(): void;
}

interface MapplsMarkerOptions {
  element: HTMLElement;
  position: [number, number]; // [longitude, latitude]
}

interface MapplsMarker {
  addTo(map: MapplsMap): MapplsMarker;
  remove(): void;
}

interface MapplsLngLatBounds {
  extend(coordinates: [number, number]): void;
}

export {};

