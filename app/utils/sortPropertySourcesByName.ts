import { PropertyData } from '../types';

export function sortPropertySourcesByName(data: PropertyData): PropertyData {
    if (data.propertySources) {
        data.propertySources.sort((a, b) => a.name.localeCompare(b.name));
        data.propertySources.forEach((propertySource) => {
            const sortedSource: { [key: string]: string } = {};
            Object.keys(propertySource.source).sort().forEach((key) => {
                sortedSource[key] = propertySource.source[key];
            });
            propertySource.source = sortedSource;
        });
    }
    return data;
}