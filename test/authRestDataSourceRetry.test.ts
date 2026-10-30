import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../auth', () => ({
  getManager: () => ({ refresh: vi.fn() }),
}));

import { AuthRESTDataSource } from '../auth/AuthRESTDataSource';

const unauthorized = () =>
  Object.assign(new Error('401'), {
    extensions: { response: { status: 401 } },
  });

function createDataSource(session: any) {
  const dataSource = Object.create(AuthRESTDataSource.prototype);
  dataSource.session = session;
  dataSource.tokenManager = { refreshRejectedToken: vi.fn() };
  return dataSource;
}

describe('AuthRESTDataSource retry on 401', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retries the call once the rejected token is refreshed', async () => {
    const dataSource = createDataSource({ auth: { accessToken: 'a' } });
    dataSource.tokenManager.refreshRejectedToken.mockResolvedValueOnce('new');
    const call = vi
      .fn()
      .mockRejectedValueOnce(unauthorized())
      .mockResolvedValueOnce('ok');

    await expect(dataSource.withRetry(call)).resolves.toBe('ok');
    expect(dataSource.tokenManager.refreshRejectedToken).toHaveBeenCalledTimes(
      1
    );
    expect(call).toHaveBeenCalledTimes(2);
  });

  it('fails with a 401 without retrying when the token cannot be refreshed', async () => {
    const dataSource = createDataSource({ auth: { accessToken: 'a' } });
    dataSource.tokenManager.refreshRejectedToken.mockResolvedValueOnce(null);
    const call = vi.fn().mockRejectedValueOnce(unauthorized());

    await expect(dataSource.withRetry(call)).rejects.toThrow(
      'AUTH | REFRESH FAILED'
    );
    expect(call).toHaveBeenCalledTimes(1);
  });

  it('rethrows other errors untouched', async () => {
    const dataSource = createDataSource({ auth: { accessToken: 'a' } });
    const error = Object.assign(new Error('500'), {
      extensions: { response: { status: 500 } },
    });

    await expect(
      dataSource.withRetry(vi.fn().mockRejectedValueOnce(error))
    ).rejects.toBe(error);
    expect(dataSource.tokenManager.refreshRejectedToken).not.toHaveBeenCalled();
  });
});
