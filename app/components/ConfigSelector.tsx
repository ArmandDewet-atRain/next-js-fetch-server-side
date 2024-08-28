// components/ConfigSelector.tsx
import React, { useState } from 'react';

interface ConfigSelectorProps {
    onSelect: (profile: string, application: string, label: string) => void;
}

const ConfigSelector: React.FC<ConfigSelectorProps> = ({ onSelect }) => {
    const [profile, setProfile] = useState('sit');
    const [application, setApplication] = useState('account-management');
    const [label, setLabel] = useState('latest');

    const handleSelect = () => {
        onSelect(profile, application, label);
    };

    return (
        <div>
            <label>
                Profile:
                <select value={profile} onChange={(e) => setProfile(e.target.value)}>
                    <option value="sit">SIT</option>
                    <option value="prod">PROD</option>
                    <option value="local">LOCAL</option>
                </select>
            </label>

            <label>
                Application:
                <select value={application} onChange={(e) => setApplication(e.target.value)}>
                    <option value="account-management">Account Management</option>
                    <option value="payment-ingress">Payment Ingress</option>
                    {/* Add more applications as needed */}
                </select>
            </label>

            <label>
                Label:
                <select value={label} onChange={(e) => setLabel(e.target.value)}>
                    <option value="latest">Latest</option>
                    <option value="stable">Stable</option>
                    {/* Add more labels as needed */}
                </select>
            </label>

            <button onClick={handleSelect}>Fetch Configuration</button>
        </div>
    );
};

export default ConfigSelector;
