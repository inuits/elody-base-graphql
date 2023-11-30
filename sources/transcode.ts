import {AuthRESTDataSource} from "../auth";
import {TranscodeMediafileInput, TranscodeType} from "../../../generated-types/type-defs";
import {environment as env} from "../main";

export class TranscodeService extends AuthRESTDataSource {
    public baseURL = `${env?.api.transcodeService}/`;

    async generateTranscode(mediafiles: TranscodeMediafileInput[], transcodeType: TranscodeType, masterEntityId: string | undefined = undefined): Promise<any>{
        return await this.post(`transcode/${transcodeType}${masterEntityId ? '?master_entity_id='+ masterEntityId : ''}`, {body: mediafiles})
    }
}