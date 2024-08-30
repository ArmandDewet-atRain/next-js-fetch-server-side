import React from 'react';
import { CompareMaps } from '../types';

interface DiffViewerProps {
    comparison: CompareMaps;
    comparisonType: 'sitProd' | 'localSit';
}

const DiffViewer: React.FC<DiffViewerProps> = ({ comparison, comparisonType }) => {
    return (
        <table className="diff-table">
            <thead>
                <tr>
                    <th>Key</th>
                    {comparisonType === 'sitProd' && <th>SIT</th>}
                    {comparisonType === 'sitProd' && <th>PROD</th>}
                    {comparisonType === 'localSit' && <th>LOCAL</th>}
                    {comparisonType === 'localSit' && <th>SIT</th>}
                    <th>Differences</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(comparison.source).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        {comparisonType === 'sitProd' && <td>{value.sit}</td>}
                        {comparisonType === 'sitProd' && <td>{value.prod}</td>}
                        {comparisonType === 'localSit' && <td>{value.local}</td>}
                        {comparisonType === 'localSit' && <td>{value.sit}</td>}
                        <td>{value.different ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DiffViewer;
