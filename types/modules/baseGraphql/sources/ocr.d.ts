import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { Environment } from '../types/environmentTypes';
export declare class OcrService extends AuthRESTDataSource {
    env: Environment;
    baseURL: string;
    generateOcrWithAsset(assetId: string, operation: string[], language: string): Promise<any>;
}
