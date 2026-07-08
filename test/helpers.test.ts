import { vi, expect, test, describe } from 'vitest';
import {
  getTypesFromFilterInputs,
  isTypeKey,
  getClientOrigin,
  isDomainWhitelisted,
} from '../helpers/helpers';
import {
  Entitytyping,
  AdvancedFilterInput,
  Operator,
  AdvancedFilterTypes,
} from '../generated-types/type-defs';

const assetPartInputs: AdvancedFilterInput[] = [
  {
    key: 'type',
    match_exact: true,
    type: AdvancedFilterTypes.Selection,
    value: ['asset', 'asset_part'],
  },
  {
    key: ['dams:1|relations.isAssetPartFor.key'],
    match_exact: true,
    operator: Operator.Or,
    type: AdvancedFilterTypes.Selection,
    value: [
      '3857ed6b-0c5d-4452-96bb-2a8f7bf610be',
      '3857ed6b-0c5d-4452-96bb-2a8f7bf610be',
    ],
  },
  {
    key: ['dams:1|relations.hasAssetPart.key'],
    match_exact: true,
    operator: Operator.Or,
    type: AdvancedFilterTypes.Selection,
    value: [
      '3857ed6b-0c5d-4452-96bb-2a8f7bf610be',
      '3857ed6b-0c5d-4452-96bb-2a8f7bf610be',
    ],
  },
];

test('Get all types from filter inputs', () => {
  expect(
    getTypesFromFilterInputs(assetPartInputs, 'asset_part' as Entitytyping)
  ).toEqual(expect.arrayContaining(['asset_part', 'asset']));
});

test('Get types from filter inputs with schema-prefixed type key', () => {
  const filtersWithSchemaPrefix: AdvancedFilterInput[] = [
    {
      key: ['vlacc:1|type'],
      match_exact: true,
      type: AdvancedFilterTypes.Selection,
      value: ['person', 'corporation'],
    },
  ];
  expect(getTypesFromFilterInputs(filtersWithSchemaPrefix)).toEqual(
    expect.arrayContaining(['person', 'corporation'])
  );
});

describe('isTypeKey', () => {
  test('returns true for plain "type" string', () => {
    expect(isTypeKey('type')).toBe(true);
  });

  test('returns true for schema-prefixed type string', () => {
    expect(isTypeKey('vlacc:1|type')).toBe(true);
  });

  test('returns true for array with plain "type"', () => {
    expect(isTypeKey(['type'])).toBe(true);
  });

  test('returns true for array with schema-prefixed type', () => {
    expect(isTypeKey(['vlacc:1|type'])).toBe(true);
  });

  test('returns false for non-type key', () => {
    expect(isTypeKey('title')).toBe(false);
    expect(isTypeKey(['vlacc:1|title'])).toBe(false);
    expect(isTypeKey('vlacc:1|properties.title.value')).toBe(false);
  });
});

describe('getClientOrigin', () => {
  test('extracts host from the origin header', () => {
    expect(getClientOrigin({ origin: 'https://museum.example.com' })).toBe(
      'museum.example.com'
    );
  });

  test('lowercases the host and strips the port', () => {
    expect(
      getClientOrigin({ origin: 'https://Museum.Example.com:8443' })
    ).toBe('museum.example.com');
  });

  test('falls back to the referer header when origin is absent', () => {
    expect(
      getClientOrigin({ referer: 'https://ref.example.com/some/path' })
    ).toBe('ref.example.com');
  });

  test('prefers origin over referer', () => {
    expect(
      getClientOrigin({
        origin: 'https://origin.example.com',
        referer: 'https://ref.example.com',
      })
    ).toBe('origin.example.com');
  });

  test('returns undefined when neither header is present', () => {
    expect(getClientOrigin({})).toBeUndefined();
  });

  test('returns undefined for an unparseable value', () => {
    expect(getClientOrigin({ origin: 'not a url' })).toBeUndefined();
  });
});

describe('isDomainWhitelisted', () => {
  const envWith = (whiteListedDomainAddresses: string[]): any => ({
    features: { domainWhiteListing: { whiteListedDomainAddresses } },
  });

  test('returns true for an exact host match', () => {
    expect(
      isDomainWhitelisted('museum.example.com', envWith(['museum.example.com']))
    ).toBe(true);
  });

  test('matches case-insensitively', () => {
    expect(
      isDomainWhitelisted('museum.example.com', envWith(['Museum.Example.com']))
    ).toBe(true);
  });

  test('returns false for a non-whitelisted host', () => {
    expect(
      isDomainWhitelisted('evil.com', envWith(['museum.example.com']))
    ).toBe(false);
  });

  test('does not match subdomains (exact only)', () => {
    expect(
      isDomainWhitelisted('foo.example.com', envWith(['example.com']))
    ).toBe(false);
  });

  test('returns false when origin is undefined', () => {
    expect(
      isDomainWhitelisted(undefined, envWith(['museum.example.com']))
    ).toBe(false);
  });

  test('returns false when the feature is not configured', () => {
    expect(isDomainWhitelisted('museum.example.com', { features: {} } as any)).toBe(
      false
    );
  });

  test('matches a whitelist entry that includes a scheme', () => {
    expect(
      isDomainWhitelisted(
        'museum.example.com',
        envWith(['https://museum.example.com'])
      )
    ).toBe(true);
  });

  test('matches a whitelist entry that includes a scheme and trailing slash', () => {
    expect(
      isDomainWhitelisted(
        'museum.example.com',
        envWith(['https://museum.example.com/'])
      )
    ).toBe(true);
  });

  test('ignores surrounding whitespace on a whitelist entry', () => {
    expect(
      isDomainWhitelisted(
        'museum.example.com',
        envWith([' museum.example.com '])
      )
    ).toBe(true);
  });
});
