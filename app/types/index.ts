export interface ComparisonMap {
    sit: string;
    prod: string;
    local: string;
    sitMissing: boolean;
    prodMissing: boolean;
    localMissing: boolean;
    different: boolean;
}

export interface CompareMaps {
    source: { [key: string]: ComparisonMap }
}

export interface PropertySource {
    name: string;
    source: { [key: string]: string };
}

export interface PropertyData {
    name: string;
    profiles: string[];
    label: string;
    version: string | null;
    state: string | null;
    propertySources?: PropertySource[];
}

export interface SITData extends PropertyData {}

export interface ProdData extends PropertyData {}

export interface LocalhostData extends PropertyData {}
