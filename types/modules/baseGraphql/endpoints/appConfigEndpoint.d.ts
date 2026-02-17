import { Express } from 'express';
import { Environment } from '../types/environmentTypes';
import { TypeUrlMapping } from '../types';
export declare const applyAppConfigsEndpoint: (app: Express, config: Environment, translations: {
    [key: string]: Object;
}, urlMapping: TypeUrlMapping) => void;
