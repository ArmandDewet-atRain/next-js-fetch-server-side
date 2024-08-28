import React from 'react';
import { PropertyData } from '../types';

interface ConfigurationDisplayProps {
    sitData: PropertyData;
    prodData: PropertyData;
    localData: PropertyData;
}

const ConfigurationDisplay: React.FC<ConfigurationDisplayProps> = ({ sitData, prodData, localData }) => {
    const renderPropertySources = (data: PropertyData) => {
        return (
            <div>
                <h3>{data.name}</h3>
                {data.propertySources?.map((propertySource, index) => (
                    <div key={index}>
                        <h4>{propertySource.name}</h4>
                        <ul>
                            {Object.entries(propertySource.source).map(([key, value], i) => (
                                <li key={i}>{key}: {value}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
                <h2>SIT Environment</h2>
                {renderPropertySources(sitData)}
            </div>
            <div>
                <h2>Production Environment</h2>
                {renderPropertySources(prodData)}
            </div>
            <div>
                <h2>Local Environment</h2>
                {renderPropertySources(localData)}
            </div>
        </div>
    );
};

export default ConfigurationDisplay;
