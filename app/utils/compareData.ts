import { PropertyData, CompareMaps, ComparisonMap } from '../types/index';

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
    Object.assign(localMap, mapPropertySources(local.propertySources));

    const allKeys = Array.from(new Set([...Object.keys(sitMap), ...Object.keys(prodMap), ...Object.keys(localMap)]));

    allKeys.forEach((key) => {
        const sitValue = sitMap[key] || '';
        const prodValue = prodMap[key] || '';
        const localValue = localMap[key] || '';

        const different = sitValue !== prodValue || sitValue !== localValue || prodValue !== localValue;

        if (different) {
            comparison.source[key] = {
                sit: sitValue,
                prod: prodValue,
                local: localValue,  // Now correctly typed
                sitMissing: !sitMap[key],
                prodMissing: !prodMap[key],
                localMissing: !localMap[key],
                different,
            };
        }
    });

    return comparison;
}