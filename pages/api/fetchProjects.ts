// File: pages/api/fetchProjects.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const gitlabToken = process.env.GITLAB_ACCESS_TOKEN;

    if (!gitlabToken) {
        return res.status(500).json({ error: 'GitLab token not found' });
    }

    const groupId = '263'; // Replace with your actual group ID
    let page = 1;
    let allProjects: any[] = [];
    let hasMoreProjects = true;

    try {
        while (hasMoreProjects) {
            const response = await fetch(`https://git.rain.network/api/v4/groups/${groupId}/projects?per_page=100&page=${page}`, {
                headers: {
                    'PRIVATE-TOKEN': gitlabToken,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                return res.status(response.status).json({ error: errorText });
            }

            const projects = await response.json();
            allProjects = [...allProjects, ...projects];

            if (projects.length < 100) {
                hasMoreProjects = false;
            } else {
                page++;
            }
        }

        res.status(200).json(allProjects);
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
}
