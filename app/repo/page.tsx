'use client';
import React, { useState } from 'react';
import ConfigSelector from '../components/ConfigSelector';

const HomePage: React.FC = () => {
    const [data, setData] = useState<{ [key: string]: any } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

    const fetchData = async (profile: string, application: string, label: string) => {
        setLoading(true);
        setError(null);
        setSelectedProfile(profile);

        const url = `/api/config/fetchConfig?profile=${profile}&application=${application}&label=${label}`;
        console.log('Fetching URL:', url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
            const result = await response.json();
            console.log('Fetched Data:', result);

            setData((prevData) => ({
                ...prevData,
                [profile]: result,
            }));
        } catch (error) {
            setError((error as Error).message);
            console.error('Failed to load configuration data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Configuration Data</h1>
            <ConfigSelector onSelect={fetchData} />
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div className="data-container">
                {selectedProfile === 'sit' && data?.sit && (
                    <div className="data-section">
                        <h2>SIT Data</h2>
                        <pre>{JSON.stringify(data.sit, null, 2)}</pre>
                    </div>
                )}
                {selectedProfile === 'prod' && data?.prod && (
                    <div className="data-section">
                        <h2>PROD Data</h2>
                        <pre>{JSON.stringify(data.prod, null, 2)}</pre>
                    </div>
                )}
                {selectedProfile === 'local' && data?.local && (
                    <div className="data-section">
                        <h2>LOCAL Data</h2>
                        <pre>{JSON.stringify(data.local, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
