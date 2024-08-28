// File: components/ConfigSelector.tsx

import React, { useState } from 'react';

interface ConfigSelectorProps {
    onSelect: (profile: string, application: string, label: string) => void;
}

const ConfigSelector: React.FC<ConfigSelectorProps> = ({ onSelect }) => {
    const [profile, setProfile] = useState('sit');
    const [application, setApplication] = useState('account-management');
    const [label, setLabel] = useState('latest');

    const handleFetch = () => {
        onSelect(profile, application, label);
    };

    return (
        <div>
            <select value={profile} onChange={(e) => setProfile(e.target.value)}>
                <option value="sit">SIT</option>
                <option value="prod">PROD</option>
                <option value="local">Local</option>
                <option value="compare">Compare SIT and PROD</option>
            </select>
            <select value={application} onChange={(e) => setApplication(e.target.value)}>
                <option value="account-management">Account Management</option>
                {/* Add other applications here */}
            </select>
            <select value={label} onChange={(e) => setLabel(e.target.value)}>
                <option value="latest">Latest</option>
                {/* Add other labels here */}
            </select>
            <button onClick={handleFetch}>Fetch Configuration</button>
        </div>
    );
};

export default ConfigSelector;
