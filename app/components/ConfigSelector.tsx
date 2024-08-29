// File: components/ConfigSelector.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface ConfigSelectorProps {
    onSelect: (profile: string, application: string, label: string) => void;
}

const ConfigSelector: React.FC<ConfigSelectorProps> = ({ onSelect }) => {
    const [profile, setProfile] = useState('sit');
    const [application, setApplication] = useState('');
    const [label, setLabel] = useState('latest');
    const [projects, setProjects] = useState<{ name: string; id: number }[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/fetchProjects');
                if (!response.ok) {
                    throw new Error(`Failed to fetch projects: ${response.status}`);
                }
                const data = await response.json();
                setProjects(data);
                if (data.length > 0) {
                    setApplication(data[0].id.toString());
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

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
                {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                        {project.name}
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
