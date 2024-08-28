
import { PropertyData, CompareMaps } from '../types';
import { sortPropertySourcesByName } from './sortPropertySourcesByName';
import { compareData } from './compareData';
import { curlConfig } from '../config/curlConfig'; 
import { use } from 'react';
import { Server } from 'http';

export const getConfigurationData = async () => {
    try {
        const sitResponse = await fetch(curlConfig.sitApiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => response.json());

        const prodResponse = await fetch(curlConfig.prodApiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => response.json());

        const localResponse = await fetch(curlConfig.localApiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => response.json());

        const returnData = {
            sitData: sortPropertySourcesByName(sitResponse),
            prodData: sortPropertySourcesByName(prodResponse),
            localData: sortPropertySourcesByName(localResponse),
            comparison: {} as CompareMaps,
        };
        returnData['comparison'] = compareData(returnData.sitData, returnData.prodData,returnData.localData);
        return returnData;
    } catch (error) {
        console.error('Failed to fetch configuration data:', error);
        throw error;
    }
};
