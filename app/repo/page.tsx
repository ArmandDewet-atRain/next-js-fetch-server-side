// File: app/page.tsx or app/index.tsx

'use client';

import React, { useState } from 'react';
import ConfigSelector from '../components/ConfigSelector';
import DiffViewer from '../repo/DiffViewer'; // Adjusted the import path
import { PropertyData, CompareMaps } from '../types';
import { compareData } from '../utils/compareData';

const Page: React.FC = () => {
    const [data, setData] = useState<PropertyData | null>(null);
    const [comparison, setComparison] = useState<CompareMaps | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (profile: string, application: string, label: string) => {
        setLoading(true);
        setError(null);
        setComparison(null);
        setData(null);

        try {
            if (profile === 'compare') {
                const sitResponse = await fetch(`/api/config/fetchConfig?profile=sit&application=${application}&label=${label}`);
                const prodResponse = await fetch(`/api/config/fetchConfig?profile=prod&application=${application}&label=${label}`);
                const localResponse = await fetch(`/api/config/fetchConfig?profile=local&application=${application}&label=${label}`);

                if (!sitResponse.ok || !prodResponse.ok || !localResponse.ok) {
                    throw new Error('Failed to fetch SIT, PROD, or Local data');
                }

                const sitData = await sitResponse.json();
                const prodData = await prodResponse.json();
                const localData = await localResponse.json();

                const comparisonResult = compareData(sitData, prodData, localData);
                setComparison(comparisonResult);
            } else {
                const response = await fetch(`/api/config/fetchConfig?profile=${profile}&application=${application}&label=${label}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            }
        } catch (error) {
            setError((error as Error).message);
            console.error('Failed to load configuration data:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortDataAlphabetically = (data: PropertyData | null): PropertyData | null => {
        if (!data) return null;

        const sortedPropertySources = data.propertySources?.map((source) => ({
            ...source,
            source: Object.keys(source.source)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = source.source[key];
                    return acc;
                }, {} as { [key: string]: string }),
        }));

        return {
            ...data,
            propertySources: sortedPropertySources,
        };
    };

    return (
        <div className="container">
            <h1>Configuration Data</h1>
            <ConfigSelector onSelect={fetchData} />
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {data && (
                <div className="data-section">
                    <h2>{data.name} Data</h2>
                    <pre className="codeBox">{JSON.stringify(sortDataAlphabetically(data), null, 2)}</pre>
                </div>
            )}
            {comparison && (
                <div className="diff-viewer">
                    <DiffViewer comparison={comparison} />
                </div>
            )}
        </div>
    );
};

export default Page;
