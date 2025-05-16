// Create a new file: src/types/global.d.ts
declare global {
    interface Window {
        google: typeof google;
        [key: string]: any;
    }

    namespace google {
        namespace maps {
            class Map {
                constructor(element: HTMLElement, opts?: MapOptions);
                fitBounds(bounds: LatLngBounds): void;
                setZoom(zoom: number): void;
                getZoom(): number;
            }

            class InfoWindow {
                constructor(opts?: InfoWindowOptions);
                setContent(content: string): void;
                open(map: Map, marker: Marker): void;
            }

            class Marker {
                constructor(opts?: MarkerOptions);
                setMap(map: Map | null): void;
                addListener(eventName: string, handler: () => void): void;
            }

            class LatLngBounds {
                constructor();
                extend(latLng: { lat: number; lng: number }): void;
            }

            namespace event {
                function addListener(instance: any, eventName: string, handler: () => void): any;
                function removeListener(listener: any): void;
                function trigger(instance: any, eventName: string): void;
            }

            interface MapOptions {
                zoom?: number;
                center?: { lat: number; lng: number };
                mapTypeId?: MapTypeId;
            }

            interface InfoWindowOptions {
                content?: string;
            }

            interface MarkerOptions {
                position: { lat: number; lng: number };
                map?: Map;
                title?: string;
                icon?: any;
                zIndex?: number;
            }

            enum MapTypeId {
                ROADMAP = 'roadmap'
            }

            class Size {
                constructor(width: number, height: number);
            }

            class Point {
                constructor(x: number, y: number);
            }
        }
    }
}

export {};