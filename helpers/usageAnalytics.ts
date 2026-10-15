import { UsageAnalytics } from '../types/environmentTypes';

// Usage analytics (OpenPanel) is off unless a deployment names the project's
// client id and the API the browser can reach. The client id is public: the
// browser sends it with every event; the client secret never goes to the PWA.
export const usageAnalyticsFromEnv = (
  env: NodeJS.ProcessEnv
): UsageAnalytics | undefined =>
  env.OPENPANEL_CLIENT_ID && env.OPENPANEL_API_URL
    ? {
        clientId: env.OPENPANEL_CLIENT_ID,
        apiUrl: env.OPENPANEL_API_URL,
      }
    : undefined;
