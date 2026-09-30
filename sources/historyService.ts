import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';

export class HistoryServiceAPI extends AuthRESTDataSource {
  public baseURL = `${this.environment.api.historyServiceUrl}/`;

  async getAllHistoryEntries(id: string, type: string): Promise<any[]> {
    return await this.get<any[]>(`history/${type}/${id}/all`);
  }

  async getResolvedHistoryEntry(
    id: string,
    type: string,
    timestamp: string
  ): Promise<any | null> {
    try {
      return await this.get<any>(`history/${type}/${id}/resolved`, {
        params: { timestamp },
      });
    } catch (error: any) {
      if (error?.extensions?.response?.status === 404) return null;
      throw error;
    }
  }
}
