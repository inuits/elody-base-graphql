import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { MediaFile, TranscodeType } from '../../../generated-types/type-defs';
import { Environment } from '../types/environmentTypes';
export declare class TranscodeService extends AuthRESTDataSource {
    env: Environment;
    baseURL: string;
    generateTranscode(mediafiles: MediaFile[], transcodeType: TranscodeType, masterEntityId?: string | undefined): Promise<any>;
    downloadItemsInZip(body: any): Promise<any>;
}
