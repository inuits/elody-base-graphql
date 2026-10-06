import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HistoryServiceAPI } from '../sources/historyService';

vi.mock('../auth/AuthRESTDataSource', () => ({
  AuthRESTDataSource: class {},
}));

const historyServiceAPI = Object.create(
  HistoryServiceAPI.prototype
) as HistoryServiceAPI;
const get = vi.fn();
(historyServiceAPI as any).get = get;

describe('HistoryServiceAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads every history entry of an entity', async () => {
    get.mockResolvedValueOnce([{ _id: 'h1' }]);

    const result = await historyServiceAPI.getAllHistoryEntries(
      'W-1',
      'work_word'
    );

    expect(result).toStrictEqual([{ _id: 'h1' }]);
    expect(get).toHaveBeenCalledWith('history/work_word/W-1/all');
  });

  it('reads the resolved history entry at a point in time', async () => {
    get.mockResolvedValueOnce({ _id: 'h1' });

    const result = await historyServiceAPI.getResolvedHistoryEntry(
      'W-1',
      'work_word',
      '2026-01-01T00:00:00+00:00'
    );

    expect(result).toStrictEqual({ _id: 'h1' });
    expect(get).toHaveBeenCalledWith('history/work_word/W-1/resolved', {
      params: { timestamp: '2026-01-01T00:00:00+00:00' },
    });
  });

  it('treats an unknown version as not found instead of failing the query', async () => {
    get.mockRejectedValueOnce(
      Object.assign(new Error('Not Found'), {
        extensions: { response: { status: 404 } },
      })
    );

    const result = await historyServiceAPI.getResolvedHistoryEntry(
      'W-1',
      'work_word',
      'missing'
    );

    expect(result).toBeNull();
  });
});
