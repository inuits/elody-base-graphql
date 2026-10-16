import { UsageAnalytics } from '../types/environmentTypes';
import { BROWSER_USAGE_PATH } from '../endpoints/telemetryEndpoint';

// Usage analytics (OpenPanel) is off unless a deployment names the project's
// client id and where OpenPanel is: inside the network (OPENPANEL_INTERNAL_URL,
// the browser then sends through this server, endpoints/telemetryEndpoint.ts)
// or an API the browser can reach itself (OPENPANEL_API_URL). The client id is
// public: the browser sends it with every event; the secret never goes to the PWA.
export const usageAnalyticsFromEnv = (
  env: NodeJS.ProcessEnv
): UsageAnalytics | undefined => {
  if (!env.OPENPANEL_CLIENT_ID) return undefined;
  const apiUrl = env.OPENPANEL_INTERNAL_URL
    ? BROWSER_USAGE_PATH
    : env.OPENPANEL_API_URL;
  return apiUrl ? { clientId: env.OPENPANEL_CLIENT_ID, apiUrl } : undefined;
};
