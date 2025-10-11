// Global type definitions for Mappls SDK
declare global {
  interface Window {
    mappls?: {
      Map: new (element: HTMLElement, options: any) => any;
      Marker: new (options: any) => any;
      InfoWindow: new (options: any) => any;
      LatLngBounds?: new () => any;
    };
    mappls_plugin?: any;
  }
}

export {};
