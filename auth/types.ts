export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  tokenEndpoint: string;
  redirectUri: string;
  expires_in: number;
  refresh_expires_in: number;
}

export type TokenBody = {
  grant_type?: "refresh_token" | "authorization_code";
  client_secret: string;
  client_id: string;
};

export type AuthenticationBody = TokenBody & {
  code: string;
  redirect_uri: string;
};

export type LogoutBody = TokenBody & {
  prompt: "none";
  refresh_token: string;
};

export type RefreshBody = TokenBody & {
  prompt: "none";
  refresh_token: string;
  oidc_url: string;
};

export type AuthSessionResponse = {
  accessToken: string;
  refreshToken: string;
};

export type EnvConfig = {
  tokenLogging?: string | null | undefined;
  staticJWT: string | null | undefined;
};
