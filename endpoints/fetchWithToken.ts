import { getCurrentEnvironment } from '../environment';
import { AuthTokenManager } from '../auth/authTokenManager';
import { getClientOrigin } from '../helpers/helpers';

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
    req.headers['x-forwarded-for'],
    getClientOrigin(req.headers)
  );

  const token = await handler.getValidToken();
  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, options);
  return response;
};
