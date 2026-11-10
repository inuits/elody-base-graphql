import { UserGroup } from '../types/environmentTypes';

// The group a user's usage (OpenPanel) and traces (HyperDX) are counted in
// differs per client. ANALYTICS_GROUP_SOURCE says where it comes from: the
// domain of the user's e-mail address (emailDomain, as it always was) or the
// tenant the user works in (tenant). ANALYTICS_GROUP_TYPE is what the client
// calls it: a library, an organisation, a venue.
const SOURCES = ['emailDomain', 'tenant'] as const;
const DEFAULT_TYPE = { emailDomain: 'library', tenant: 'organisation' };

export const userGroupFromEnv = (env: NodeJS.ProcessEnv): UserGroup => {
  const source = env.ANALYTICS_GROUP_SOURCE || 'emailDomain';
  if (!SOURCES.includes(source as UserGroup['source']))
    throw new Error(
      `ANALYTICS_GROUP_SOURCE is ${SOURCES.join(' or ')}, not "${source}"`
    );
  const type =
    env.ANALYTICS_GROUP_TYPE || DEFAULT_TYPE[source as UserGroup['source']];
  if (!/^[a-z][a-z0-9_-]*$/.test(type))
    throw new Error(
      `ANALYTICS_GROUP_TYPE is a plain name (lowercase letters, digits, - and _), not "${type}"`
    );
  return { source: source as UserGroup['source'], type };
};
