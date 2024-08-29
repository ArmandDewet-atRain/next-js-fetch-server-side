// File: pages/api/fetchProjects.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const gitlabToken = process.env.GITLAB_ACCESS_TOKEN;

    if (!gitlabToken) {
        return res.status(500).json({ error: 'GitLab token not found' });
    }

    try {
        const response = await fetch('https://git.rain.network/api/v4/groups/263/projects', {
            headers: {
                'PRIVATE-TOKEN': gitlabToken,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const projects = await response.json();
        res.status(200).json(projects);
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
}
