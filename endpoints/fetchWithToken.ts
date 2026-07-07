import { getCurrentEnvironment } from '../environment';
import { AuthTokenManager } from '../auth/authTokenManager';

export const fetchWithTokenRefresh = async (
  url: string,
  options: any,
  req: any
): Promise<Response> => {
  if (!req?.session) {
    throw new Error(
      'fetchWithTokenRefresh: req with an attached session is required as the 3rd argument. Signature: fetchWithTokenRefresh(url, options, req).'
    );
  }
  const env = getCurrentEnvironment();
  const handler = new AuthTokenManager(
    env,
    req.session,
    req.headers['x-forwarded-for']
  );

  const token = await handler.getValidToken();
  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, options);
  return response;
};
