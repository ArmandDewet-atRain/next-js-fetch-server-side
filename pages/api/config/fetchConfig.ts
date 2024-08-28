// pages/api/config/fetchConfig.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const username = 'axiom4';
    const password = 'LetItRain123';
    const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    const fetchWithGracefulErrorHandling = async (url: string, options: RequestInit) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                console.error(`Request to ${url} failed with status: ${response.status}`);
                return null;
            }
            return await response.json();
        } catch (error: unknown) {
            console.error(`Fetch failed for ${url}:`, (error as Error).message);
            return null;
        }
    };

    const getUrl = (profile: string, application: string, label: string) => {
        if (profile === 'sit') {
            return `https://api.sit.rain.co.za/axiom/configserver/${application}/${profile}/${label}`;
        } else {
            return `https://api.axiom.rain.co.za/bss-prod/configserver/${application}/${profile}/${label}`;
        }
    };

    const { profile, application, label } = req.query as { profile: string; application: string; label: string };

    try {
        console.log(`Fetching data for ${profile}, ${application}, ${label}...`);

        const url = getUrl(profile, application, label);
        const data = await fetchWithGracefulErrorHandling(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': basicAuth,
            },
        });

        res.status(200).json(data);
    } catch (error: unknown) {
        console.error('Error in API route:', (error as Error).message);
        res.status(500).json({ error: (error as Error).message });
    }
}
