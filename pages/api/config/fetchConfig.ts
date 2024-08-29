import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const username = 'axiom4';
    const password = 'LetItRain123';
    const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    const { profile, application, label } = req.query;

    let url = '';
    if (profile === 'sit') {
        url = `https://api.sit.rain.co.za/axiom/configserver/${application}/${profile}/${label}`;
    } else if (profile === 'prod') {
        url = `https://api.axiom.rain.co.za/bss-prod/configserver/${application}/${profile}/${label}`;
    } else if (profile === 'local') {
        url = `https://git.rain.network/api/v4/projects/1023/repository/files/src%2Fmain%2Fresources%2Fapplication-default.properties/raw?ref=main`;
    } else {
        return res.status(400).json({ error: 'Invalid profile specified' });
    }

    console.log(`Fetching from URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': profile === 'local' ? 'text/plain' : 'application/json',
                'Authorization': profile === 'local' ? `Bearer ${process.env.GITLAB_ACCESS_TOKEN}` : basicAuth,
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
            data = textData.split('\n').reduce((acc, line) => {
                const [key, value] = line.split('=');
                if (key && value) {
                    acc[key.trim()] = value.trim();
                }
                return acc;
            }, {} as Record<string, string>);
        } else {
            data = await response.json();
        }

        res.status(200).json(data);
    } catch (error: unknown) {
        console.error('Error in API route:', (error as Error).message);
        res.status(500).json({ error: (error as Error).message });
    }
}
