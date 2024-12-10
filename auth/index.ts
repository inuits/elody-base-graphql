import session, { SessionOptions } from 'express-session';
import jwt_decode from 'jwt-decode';
import { AuthManager } from './auth-manager';
import { logToken } from './debug';
import { AuthSessionResponse, EnvConfig } from './types';
import { applyConfig } from './libConfig';
import MongoStore from 'connect-mongo';

declare module 'express-session' {
  interface SessionData {
    auth: AuthSessionResponse | undefined;
  }
}

export async function applyAuthSession(
  app: any,
  clientSecret: string,
  mongoUrl: string,
  hasPersistentSessions: boolean = true
) {
  const sessionOptions: SessionOptions = {
    secret: clientSecret,
    saveUninitialized: true,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    },
  };

  if (hasPersistentSessions) {
    Object.assign(sessionOptions, {
      store: MongoStore.create({ mongoUrl: mongoUrl }),
    });
  }

  app.use(session(sessionOptions));
}

export let manager: AuthManager | null = null;

export function applyAuthEndpoints(
  app: any,
  oauthBaseUrl: string,
  clientSecret: string
) {
  app.get('/api/logout', async (req: any, res: any) => {
    logToken(undefined, `index /api/logout`);
    req.session.auth != null && manager != null
      ? manager?.logout(
          req.session.auth.accessToken,
          req.session.auth.refreshToken
        )
      : null;
    req.session.auth = undefined;
    res.status(200).end('Logged out');
  });

  app.post('/api/auth_code', async (req: any, res: any) => {
    logToken(undefined, `index /api/auth_code`);
    if (req.session.auth && req.session.auth?.accessToken) {
      logToken(
        req.session.auth.accessToken,
        `index /api/auth_code`,
        `User still authenticated`
      );
      res.status(200).end('Session token still present.');
      return;
    }
    const { authCode, clientId, tokenEndpoint, redirectUri, logoutEndpoint } =
      req.body;
    manager = new AuthManager(
      oauthBaseUrl,
      clientId,
      clientSecret,
      tokenEndpoint,
      logoutEndpoint
    );
    try {
      req.session.auth = await manager.authenticate(authCode, redirectUri);
      res.status(200).end('Got token succesfully.');
    } catch (e: any) {
      req.session.auth = undefined;
      console.error(e);
      console.log(`\n \t AUTH | EXPRESS | ERROR WHILE AUTHENTICATING`);
      res.status(401).end('Something went wrong. ' + e.toString());
    }
  });

  app.get('/api/me', async (req: any, res: any) => {
    if (!req.session?.auth?.accessToken) {
      logToken(
        req.session?.auth?.accessToken,
        `index /api/me`,
        `User unauthorized`
      );
      res.status(401).end('Unauthorized');
    } else {
      res.end(JSON.stringify(getMe(req.session.auth.accessToken)));
    }
  });
}

export function getMe(accessToken: string): any {
  return jwt_decode(accessToken);
}

export function applyEnvironmentConfig(_config: EnvConfig) {
  applyConfig(_config);
}
