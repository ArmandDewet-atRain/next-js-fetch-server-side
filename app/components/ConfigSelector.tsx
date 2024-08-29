'use client';

import React, { useState } from 'react';

interface ConfigSelectorProps {
    onSelect: (profile: string, application: string, label: string) => void;
}

const copy_and_commit_params = [
    ["PrepayBalanceManagement", "prepay-balance-management"],
    // ... (other entries)
].sort((a, b) => a[0].localeCompare(b[0]));

const ConfigSelector: React.FC<ConfigSelectorProps> = ({ onSelect }) => {
    const [profile, setProfile] = useState('sit');
    const [application, setApplication] = useState(copy_and_commit_params[0][1]);
    const [label, setLabel] = useState('latest');

    const handleFetch = () => {
        onSelect(profile, application, label);
    };

    return (
        <div>
            <select value={profile} onChange={(e) => setProfile(e.target.value)}>
                <option value="sit">SIT</option>
                <option value="prod">PROD</option>
                <option value="local">LOCAL</option>
                <option value="compare">Compare SIT and PROD</option>
            </select>
            <select value={application} onChange={(e) => setApplication(e.target.value)}>
                {copy_and_commit_params.map(([name, value]) => (
                    <option key={value} value={value}>
                        {name}
                    </option>
                ))}
            </select>
            <select value={label} onChange={(e) => setLabel(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="stable">Stable</option>
            </select>
            <button onClick={handleFetch}>Fetch Configuration</button>
        </div>
    );
};

export default ConfigSelector;