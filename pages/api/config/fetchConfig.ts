import type { NextApiRequest, NextApiResponse } from 'next';

async function fetchProjectIdByName(projectName: string, gitlabToken: string): Promise<number | null> {
    try {
        const response = await fetch('https://git.rain.network/api/v4/groups/263/projects', {
            headers: {
                'PRIVATE-TOKEN': gitlabToken,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch project list');
            return null;
        }

        const projects = await response.json();
        const project = projects.find((proj: any) => proj.name === projectName);

        return project ? project.id : null;
    } catch (error) {
        console.error('Error fetching project ID:', error);
        return null;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const username = 'axiom4';
    const password = 'LetItRain123';
    const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    const { profile, application, label } = req.query;

    let url = '';
    const gitlabToken = process.env.GITLAB_ACCESS_TOKEN;

    if (!gitlabToken) {
        console.error('GitLab token not found');
        return res.status(500).json({ error: 'GitLab token not found' });
    }

    if (profile === 'sit') {
        url = `https://api.sit.rain.co.za/axiom/configserver/${application}/${profile}/${label}`;
    } else if (profile === 'prod') {
        url = `https://api.axiom.rain.co.za/bss-prod/configserver/${application}/${profile}/${label}`;
    } else if (profile === 'local') {
        
        const projectId = await fetchProjectIdByName(application as string, gitlabToken);

        if (!projectId) {
            console.error(`Failed to fetch project ID for local environment and application ${application}`);
            return res.status(500).json({ error: `Failed to fetch project ID for local environment and application ${application}` });
        }

        url = `https://git.rain.network/api/v4/projects/${projectId}/repository/files/src%2Fmain%2Fresources%2Fapplication-default.properties/raw?ref=main`;
    } else {
        console.error('Invalid profile specified');
        return res.status(400).json({ error: 'Invalid profile specified' });
    }

    console.log(`Fetching from URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': profile === 'local' ? 'text/plain' : 'application/json',
                'Authorization': profile === 'local' ? `Bearer ${gitlabToken}` : basicAuth,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Request to ${url} failed with status: ${response.status}. Response: ${errorText}`);
            return res.status(500).json({ error: `Failed to fetch data. Status: ${response.status}`, details: errorText });
        }

        let data;
        if (profile === 'local') {
            const textData = await response.text();
            let datasources = textData.split('\n').reduce((acc, line) => {
                const [key, value] = line.split('=');
                if (key && value) {
                    acc[key.trim()] = value.trim();
                }
                return acc;
            }, {} as Record<string, string>);
            data = {
                "name": application,
                "profiles": [
                  profile
                ],
                "label": label,
                "version": null,
                "state": null,
                "propertySources": [
                  {
                    "name": `${application}-${profile}`,
                    "source": datasources
                }
                  ]
                };
        } else {
            data = await response.json();
        }
       
        res.status(200).json(data);
    } catch (error: unknown) {
        console.error('Error in API route:', (error as Error).message);
        res.status(500).json({ error: (error as Error).message });
    }
}
