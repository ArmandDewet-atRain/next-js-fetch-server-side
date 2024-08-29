// File: pages/api/config/fetchApplications.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const gitlabToken = process.env.GITLAB_ACCESS_TOKEN;

  if (!gitlabToken) {
    return res.status(500).json({ error: 'GitLab access token is missing' });
  }

  try {
    // Fetch the list of projects in the group
    const response = await fetch('https://git.rain.network/api/v4/groups/263/projects', {
      headers: {
        'PRIVATE-TOKEN': gitlabToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch applications. Response: ${errorText}`);
      return res.status(500).json({ error: `Failed to fetch applications. Status: ${response.status}`, details: errorText });
    }

    const projects = await response.json();
    res.status(200).json(projects);
  } catch (error: unknown) {
    console.error('Error in API route:', (error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
}
