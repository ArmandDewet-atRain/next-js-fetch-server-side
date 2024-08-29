import React from 'react';
import { CompareMaps } from '../types';

interface DiffViewerProps {
    comparison: CompareMaps;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ comparison }) => {
    return (
        <table className="diff-table">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>SIT</th>
                    <th>PROD</th>
                    <th>LOCAL</th>
                    <th>Differences</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(comparison.source).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{value.sit}</td>
                        <td>{value.prod}</td>
                        <td>{value.local}</td>
                        <td>{value.different ? 'Yes' : 'No'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DiffViewer;
