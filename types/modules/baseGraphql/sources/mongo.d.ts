import { Environment } from '../types/environmentTypes';
export declare const isMongoConfigAvailable: () => boolean;
export declare const createMongoConnectionString: (appConfig: Environment) => string;
