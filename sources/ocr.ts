import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';
import start, { environment as env } from '../main';

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
        for (let currentOperation of operation) {
            body["operation"] = currentOperation;
            await this.post(
                `ocr?language=${language}`,
                { body: body, headers: { 'Content-Type': 'application/json' } }
            ).then((result) => {
                if (typeof result === "object")
                    throw new Error(
                        `${result.message ? result.message : result}`
                    );
                else resultsArray.push(result);
            });
        }
        return resultsArray;
    }
}
