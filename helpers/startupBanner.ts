import { Environment } from '../types/environmentTypes';
import { autoDefaultedSecrets } from '../environment';

export const printStartupBanner = (environment: Environment): void => {
  const title = `${environment.customization?.applicationTitle ?? 'Elody'} GraphQL`;
  const oidcSource = environment.oauth.discoveryUrl
    ? `discovery (${environment.oauth.discoveryUrl})`
    : `manual (${environment.oauth.baseUrl})`;

  const rows: [string, string][] = [
    ['mode', environment.environment],
    ['version', environment.version],
    ['port', String(environment.port)],
    ['graphql path', environment.apollo.graphqlPath],
    ['collection-api', environment.api.collectionApiUrl],
    ['oidc', oidcSource],
  ];
  const labelWidth = Math.max(...rows.map(([k]) => k.length));
  const contentWidth = Math.max(
    title.length,
    ...rows.map(([k, v]) => labelWidth + 3 + v.length)
  );
  const rule = '━'.repeat(contentWidth + 4);

  console.log('');
  console.log(rule);
  console.log(`  ${title}`);
  console.log(rule);
  rows.forEach(([k, v]) => {
    console.log(`  ${k.padEnd(labelWidth)}   ${v}`);
  });
  if (autoDefaultedSecrets.length > 0) {
    console.log('');
    console.warn('  [!] auto-defaulted secrets (set before production):');
    autoDefaultedSecrets.forEach((key) => console.warn(`      - ${key}`));
  }
  console.log(rule);
  console.log('');
};
