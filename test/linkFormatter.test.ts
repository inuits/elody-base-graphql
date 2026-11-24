import { describe, expect, it } from 'vitest';
import { formatterFactory, ResolverFormatters } from '../resolvers/formatters';
import { type FormattersConfig } from '../types';

const formatterSettings = {
  link: {
    production: {
      value: 'id',
      label: 'title',
      link: '/production/$value',
      openInNewTab: false,
    },
  },
} as unknown as FormattersConfig;

const production = {
  id: 'PR-000001',
  uuid: 'uuid-1',
  type: 'production',
  metadata: [
    { key: 'title', value: 'Hamlet' },
    { key: 'description', value: 'A long description '.repeat(100) },
  ],
  relations: [{ key: 'ORG-000001', type: 'ref_companies' }],
};

const formatRelation = (entity: unknown) =>
  formatterFactory(ResolverFormatters.Relations)(
    'link|production',
    formatterSettings
  )({ entity });

const formatRoot = (entity: unknown) =>
  formatterFactory(ResolverFormatters.Root)({
    value: 'PR-000001',
    formatter: 'link|production',
    formatterSettings,
    entity,
  });

describe('link formatter', () => {
  it('links a relation to its entity by label', () => {
    expect(formatRelation(production)).toMatchObject({
      label: 'Hamlet',
      link: '/production/PR-000001',
      openInNewTab: false,
    });
  });

  it("sends only a relation's id, uuid and type, not the whole record", () => {
    expect(formatRelation(production).entity).toEqual({
      id: 'PR-000001',
      uuid: 'uuid-1',
      type: 'production',
    });
  });

  it("sends only a root value's id, uuid and type, not the whole record", () => {
    expect(formatRoot(production).entity).toEqual({
      id: 'PR-000001',
      uuid: 'uuid-1',
      type: 'production',
    });
  });

  it('keeps pointing a missing entity to not found', () => {
    expect(formatRelation('ORG-404')).toMatchObject({
      label: 'ORG-404',
      link: '/not-found',
      entity: 'ORG-404',
    });
  });
});
