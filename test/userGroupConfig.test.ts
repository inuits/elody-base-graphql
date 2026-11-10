/**
 * The group a user's usage and traces are counted in differs per client: a
 * library (the domain of the user's e-mail address, as it always was) or the
 * organisation the user works in (the selected tenant). The deployment says
 * which, and what the client calls it; the PWA reads it from the app config.
 */
import { describe, it, expect } from 'vitest';
import { userGroupFromEnv } from '../helpers/userGroup';
import { getConfig } from '../endpoints/appConfigEndpoint';
import { Environment } from '../types/environmentTypes';

const environmentWith = (userGroup: any): Environment =>
  ({
    graphqlEndpoint: '/api/graphql',
    damsFrontend: 'http://localhost',
    api: {},
    oauth: {},
    customization: {},
    features: {},
    userGroup,
  } as unknown as Environment);

describe('userGroupFromEnv', () => {
  it('is the library of the e-mail domain unless the deployment says otherwise', () => {
    expect(userGroupFromEnv({})).toEqual({
      source: 'emailDomain',
      type: 'library',
    });
  });

  it('is the organisation of the selected tenant when asked', () => {
    expect(userGroupFromEnv({ ANALYTICS_GROUP_SOURCE: 'tenant' })).toEqual({
      source: 'tenant',
      type: 'organisation',
    });
  });

  it('is called what the client calls it', () => {
    expect(
      userGroupFromEnv({
        ANALYTICS_GROUP_SOURCE: 'tenant',
        ANALYTICS_GROUP_TYPE: 'venue',
      })
    ).toEqual({ source: 'tenant', type: 'venue' });
    expect(userGroupFromEnv({ ANALYTICS_GROUP_TYPE: 'school' })).toEqual({
      source: 'emailDomain',
      type: 'school',
    });
  });

  it('refuses a source it does not know, or a type that is not a plain name', () => {
    expect(() =>
      userGroupFromEnv({ ANALYTICS_GROUP_SOURCE: 'department' })
    ).toThrow(/ANALYTICS_GROUP_SOURCE/);
    expect(() =>
      userGroupFromEnv({ ANALYTICS_GROUP_TYPE: 'Venue Name!' })
    ).toThrow(/ANALYTICS_GROUP_TYPE/);
  });
});

describe('the app config', () => {
  it('tells the PWA which group to use', () => {
    const userGroup = { source: 'tenant', type: 'organisation' };
    expect(getConfig(environmentWith(userGroup)).userGroup).toEqual(userGroup);
  });
});
