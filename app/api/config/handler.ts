import { NextApiRequest, NextApiResponse } from 'next';
import { getConfigurationData } from '../../utils/getConfigurationData';
import { PropertyData, CompareMaps } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const data = await getConfigurationData();
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}