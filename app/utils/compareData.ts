import { PropertyData, CompareMaps, ComparisonMap } from '../types';

export function compareData(sit: PropertyData, prod: PropertyData, local: PropertyData): CompareMaps {
    const comparison: CompareMaps = { source: {} };
    const sitMap: { [key: string]: string } = {};
    const prodMap: { [key: string]: string } = {};
    const localMap: { [key: string]: string } = {};

    const mapPropertySources = (propertySources: PropertyData['propertySources']): { [key: string]: string } => {
        const map: { [key: string]: string } = {};
        propertySources?.forEach((propertySource) => {
            Object.keys(propertySource.source).forEach((key) => {
                map[key] = propertySource.source[key];
            });
        });
        return map;
    };

    
    Object.assign(sitMap, mapPropertySources(sit.propertySources));
    Object.assign(prodMap, mapPropertySources(prod.propertySources));

    
    if (local && local.propertySources) {
        Object.assign(localMap, mapPropertySources(local.propertySources));
    }

   
    const allKeys = Array.from(new Set([...Object.keys(sitMap), ...Object.keys(prodMap), ...Object.keys(localMap)])).sort();

    allKeys.forEach((key) => {
        const sitValue = sitMap[key] || 'N/A';
        const prodValue = prodMap[key] || 'N/A';
        const localValue = localMap[key] || 'N/A';

        
        const different = sitValue !== prodValue || sitValue !== localValue || prodValue !== localValue;

        comparison.source[key] = {
            sit: sitValue,
            prod: prodValue,
            local: localValue,
            sitMissing: !sitMap[key],
            prodMissing: !prodMap[key],
            localMissing: !localMap[key],
            different,
        };
    });

    return comparison;
}
