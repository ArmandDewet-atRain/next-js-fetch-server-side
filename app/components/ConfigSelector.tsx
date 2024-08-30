'use client';

import React, { useState, useEffect } from 'react';

interface ConfigSelectorProps {
    onSelect: (profile: string, application: string, label: string) => void;
}

const ConfigSelector: React.FC<ConfigSelectorProps> = ({ onSelect }) => {
    const [profile, setProfile] = useState('sit');
    const [application, setApplication] = useState('');
    const [label, setLabel] = useState('latest');
    const [applications, setApplications] = useState<string[]>([]);

    
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch('/api/fetchProjects'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const data = await response.json();
                setApplications(data.map((proj: any) => proj.name)); 
                if (data.length > 0) {
                    setApplication(data[0].name); 
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, []);

    
    useEffect(() => {
        if (application) {
            onSelect(profile, application, label);
        }
    }, [profile, application, label]);

    return (
        <div>
            <select value={profile} onChange={(e) => setProfile(e.target.value)}>
                <option value="sit">SIT</option>
                <option value="prod">PROD</option>
                <option value="local">LOCAL</option>
                <option value="compare">Compare SIT and PROD</option>
            </select>
            <select value={application} onChange={(e) => setApplication(e.target.value)}>
                {applications.map((app) => (
                    <option key={app} value={app}>
                        {app}
                    </option>
                ))}
            </select>
            <select value={label} onChange={(e) => setLabel(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="stable">Stable</option>
            </select>
        </div>
    );
};

export default ConfigSelector;
