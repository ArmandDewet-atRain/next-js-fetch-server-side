'use client';

import React, { useState } from 'react';
import ConfigSelector from '../components/ConfigSelector';
import DiffViewer from '../repo/DiffViewer'; 
import { PropertyData, CompareMaps } from '../types';
import { compareData } from '../utils/compareData';

const Page: React.FC = () => {
    const [data, setData] = useState<PropertyData | null>(null);
    const [comparison, setComparison] = useState<CompareMaps | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [comparisonType, setComparisonType] = useState<'sitProd' | 'localSit'>('sitProd');

    const fetchData = async (profile: string, application: string, label: string) => {
        setLoading(true);
        setError(null);
        setComparison(null);
        setData(null);

        try {
            if (profile === 'compare') {
                const sitResponse = await fetch(`/api/config/fetchConfig?profile=sit&application=${application}&label=${label}`);
                const secondResponse = comparisonType === 'sitProd'
                    ? await fetch(`/api/config/fetchConfig?profile=prod&application=${application}&label=${label}`)
                    : await fetch(`/api/config/fetchConfig?profile=local&application=${application}&label=${label}`);

                if (!sitResponse.ok || !secondResponse.ok) {
                    throw new Error('Failed to fetch SIT, PROD, or Local data');
                }

                const sitData = await sitResponse.json();
                const secondData = await secondResponse.json();

                const comparisonResult = comparisonType === 'sitProd'
                    ? compareData(sitData, secondData, sitData)
                    : compareData(sitData, sitData, secondData);

                setComparison(comparisonResult);
            } else {
                const response = await fetch(`/api/config/fetchConfig?profile=${profile}&application=${application}&label=${label}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const result = await response.json();
                setData(sortDataAlphabetically(result));
            }
        } catch (error) {
            setError((error as Error).message);
            console.error('Failed to load configuration data:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortDataAlphabetically = (data: PropertyData): PropertyData => {
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
            
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <select onChange={(e) => setComparisonType(e.target.value as 'sitProd' | 'localSit')}>
                    <option value="sitProd">SIT vs PROD</option>
                    <option value="localSit">LOCAL vs SIT</option>
                </select>
            </div>

            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">Error: {error}</p>}
            {data && (
                <div className="data-section">
                    <h2>{data.name} Data</h2>
                    <pre className="codeBox">{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
            {comparison && (
                <div className="diff-viewer">
                    <DiffViewer comparison={comparison} comparisonType={comparisonType} />
                </div>
            )}
        </div>
    );
};

export default Page;
