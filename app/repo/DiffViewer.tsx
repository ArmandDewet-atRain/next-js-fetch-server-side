// File: repo/DiffViewer.tsx

import React from 'react';
import { CompareMaps } from '../types';

const DiffViewer: React.FC<{ comparison: CompareMaps }> = ({ comparison }) => {
    const differences = Object.entries(comparison.source)
        .filter(([, value]) => value.different)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)); // Sort alphabetically by key

    if (differences.length === 0) {
        return <p>No differences found between SIT, PROD, and Local data.</p>;
    }

    return (
        <div className="diff-viewer">
            <h2>Differences</h2>
            <table className="diff-table">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>SIT</th>
                        <th>PROD</th>
                        <th>Local</th>
                    </tr>
                </thead>
                <tbody>
                    {differences.map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{value.sit}</td>
                            <td>{value.prod}</td>
                            <td>{value.local}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DiffViewer;
