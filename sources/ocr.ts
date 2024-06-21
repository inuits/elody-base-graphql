import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import { environment as env } from '../main';

export class OcrService extends AuthRESTDataSource {
    public baseURL = `${env?.api.ocrService}/`;

    async generateOcrWithAsset(
        assetId: string,
        operation: string[],
        language: string,
    ): Promise<any> {
        const body = {
            asset_id: assetId,
            operation: ""
        };
        const resultsArray: any[] = [];
        operation.forEach( async (currentOperation) => {
            body["operation"] = currentOperation;
            const result = await this.post(
                `ocr?language=${language}`,
                { body: body, headers: { 'Content-Type': 'application/json' } }
            );
            resultsArray.push(result);
        });
        return resultsArray;
    }
}
