import React from 'react';
import { ComparisonMap, CompareMaps } from '../types';

interface DiffViewerProps {
    comparison: CompareMaps;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ comparison }) => {
    return (
        <div className="diff-viewer">
            <h2>Comparison Data</h2>
            {Object.keys(comparison.source).length > 0 ? (
                <table className="diff-table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>SIT Value</th>
                            <th>PROD Value</th>
                            <th>LOCAL Value</th>
                            <th>Difference Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(comparison.source)
                            .filter(([_, { different }]) => different)
                            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                            .map(([key, comp]) => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td className="highlight">{highlightDifferences(comp.sit, comp.prod, comp.local)}</td>
                                    <td className="highlight">{highlightDifferences(comp.prod, comp.sit, comp.local)}</td>
                                    <td className="highlight">{highlightDifferences(comp.local, comp.sit, comp.prod)}</td>
                                    <td>{getDifferenceDetails(comp)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            ) : (
                <p>No comparison data available</p>
            )}
        </div>
    );
};

function highlightDifferences(source: string, target1: string, target2: string) {
    if (!source || (!target1 && !target2)) return source;

    const sourceWords = source.split(' ');
    const targetWords1 = target1.split(' ');
    const targetWords2 = target2.split(' ');

    return sourceWords.map((word, index) =>
        word !== targetWords1[index] || word !== targetWords2[index] ? (
            <span key={index} style={{ backgroundColor: '#ffdddd' }}>{word} </span>
        ) : (
            word + ' '
        )
    );
}

function getDifferenceDetails(comp: ComparisonMap) {
    return (
        <>
            {comp.sitMissing && <div>SIT Missing</div>}
            {comp.prodMissing && <div>Prod Missing</div>}
            {comp.localMissing && <div>Local Missing</div>}
        </>
    );
}

export default DiffViewer;
