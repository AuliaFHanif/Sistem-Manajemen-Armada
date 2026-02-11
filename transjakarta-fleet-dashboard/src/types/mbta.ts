export interface MBTAVehicle {
  id: string;
  type: "vehicle";
  attributes: {
    label: string;
    latitude: number;
    longitude: number;
    current_status: string;
    updated_at: string;
    bearing: number | null;
    occupancy_status: string | null;
    current_stop_sequence: number;
  };
  relationships: {
    route: { data: { id: string; type: "route" } | null };
    stop: { data: { id: string; type: "stop" } | null };
    trip: { data: { id: string; type: "trip" } | null };
  };
}

export interface MBTARouteIncluded {
  id: string;
  type: "route";
  attributes: {
    long_name: string;
    short_name: string;
    description: string;
    color: string;
    text_color: string;
    type?: number;
  };
}

export interface MBTATripIncluded {
  id: string;
  type: "trip";
  attributes: {
    headsign: string;
    name: string;
    direction_id: number;
  };
}

export type MBTAIncluded =
  | MBTARouteIncluded
  | MBTATripIncluded
  | MBTAStopIncluded;

export interface MBTADataResponse {
  data: MBTAVehicle[];
  included?: MBTAIncluded[];
  links: {
    first: string;
    last: string;
    next?: string;
    prev?: string;
  };

  jsonapi?: { version: string };
}

export interface MBTARoute {
  id: string;
  type: "route";
  attributes: {
    long_name: string;
    short_name: string;
    color: string;
    text_color: string;
    description: string;
    direction_destinations: string[];
    direction_names: string[];
    type: number;
  };
  relationships: {
    line?: { data: { id: string; type: "line" } };
    agency?: { data: { id: string; type: "agency" } };
  };
}

export interface MBTARouteResponse {
  data: MBTARoute[];
  links: {
    first: string;
    last: string;
    next?: string;
  };
}

export interface MBTAStopIncluded {
  type: "stop";
  id: string;
  attributes: {
    name: string;
    latitude: number;
    longitude: number;
    platform_code: string | null;
    platform_name: string | null;
    address: string | null;
    description: string | null;
  };
}
