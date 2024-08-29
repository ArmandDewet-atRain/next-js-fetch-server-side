// File: components/DiffViewer.tsx

import React from 'react';
import { CompareMaps } from '../types';

interface DiffViewerProps {
    comparison: CompareMaps;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ comparison }) => {
    return (
        <div className="diffViewer">
            <h2>Comparison Results</h2>
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
                    {Object.keys(comparison.source).map((key) => {
                        const { sit, prod, local, different } = comparison.source[key];
                        return (
                            <tr key={key} className={different ? 'highlight' : ''}>
                                <td>{key}</td>
                                <td>{sit}</td>
                                <td>{prod}</td>
                                <td>{local}</td>
                                <td>{different ? 'Yes' : 'No'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DiffViewer;
