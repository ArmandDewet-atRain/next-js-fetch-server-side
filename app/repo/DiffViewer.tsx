import React from 'react';
import { CompareMaps } from '../types';

interface DiffViewerProps {
    comparison: CompareMaps;
    comparisonType: 'sitProd' | 'localSit';
    showDifferencesOnly: boolean;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ comparison, comparisonType, showDifferencesOnly }) => {
    const getClassNameForDifference = (value: string | undefined) => {
        if (!value || value === '') return ''; 
        if (value === 'N/A') return 'diff-removed'; 
        return 'diff-modified'; 
    };

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
                {Object.entries(comparison.source)
                    .filter(([_, value]) => !showDifferencesOnly || value.different)
                    .map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}</td>
                            {comparisonType === 'sitProd' && (
                                <>
                                    <td className={getClassNameForDifference(value.sit)}>{value.sit}</td>
                                    <td className={getClassNameForDifference(value.prod)}>{value.prod}</td>
                                </>
                            )}
                            {comparisonType === 'localSit' && (
                                <>
                                    <td className={getClassNameForDifference(value.local)}>{value.local}</td>
                                    <td className={getClassNameForDifference(value.sit)}>{value.sit}</td>
                                </>
                            )}
                            <td>{value.different ? 'Yes' : 'No'}</td>
                        </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DiffViewer;
