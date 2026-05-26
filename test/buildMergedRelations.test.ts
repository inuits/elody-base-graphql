import { describe, it, expect } from 'vitest';
import { buildMergedRelations } from '../helpers/helpers';
import { EditStatus } from '../generated-types/type-defs';

const rel = (type: string, key: string, extra: object = {}) => ({
  type,
  key,
  ...extra,
});

const formRel = (
  type: string,
  key: string,
  status: EditStatus,
  extra: object = {}
) => ({
  type,
  key,
  editStatus: status,
  ...extra,
});

describe('buildMergedRelations', () => {
  it('preserves existing relations not in the form', () => {
    const existing = [rel('refOrganizations', 'BA-001')];
    const formRelations = [
      formRel('refOrganizations', 'CO-002', EditStatus.New),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.key)).toContain('BA-001');
    expect(result.map((r) => r.key)).toContain('CO-002');
  });

  it('removes deleted relations', () => {
    const existing = [
      rel('refOrganizations', 'BA-001'),
      rel('refOrganizations', 'CO-002'),
    ];
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.Deleted),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('CO-002');
  });

  it('replaces existing relation when incoming has same type+key (Changed)', () => {
    const existing = [
      rel('refOrganizations', 'BA-001', {
        metadata: [{ key: 'roles', value: ['viewer'] }],
      }),
    ];
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.Changed, {
        metadata: [{ key: 'roles', value: ['admin'] }],
      }),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(1);
    expect(result[0].metadata[0].value).toEqual(['admin']);
  });

  it('replaces existing relation when incoming has same type+key (New)', () => {
    const existing = [
      rel('refOrganizations', 'BA-001', {
        metadata: [{ key: 'roles', value: ['viewer'] }],
      }),
    ];
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.New, {
        metadata: [{ key: 'roles', value: ['admin'] }],
      }),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(1);
    expect(result[0].metadata[0].value).toEqual(['admin']);
  });

  it('does not duplicate when Unchanged relation matches existing', () => {
    const existing = [
      rel('refOrganizations', 'BA-001', {
        metadata: [{ key: 'roles', value: ['admin'] }],
      }),
    ];
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.Unchanged, {
        metadata: [{ key: 'roles', value: ['admin'] }],
      }),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(1);
  });

  it('returns empty when all existing relations are deleted', () => {
    const existing = [rel('refOrganizations', 'BA-001')];
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.Deleted),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(0);
  });

  it('handles empty existing relations', () => {
    const existing: any[] = [];
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.New),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('BA-001');
  });

  it('strips editStatus and teaserMetadata from result', () => {
    const existing: any[] = [];
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.New, {
        teaserMetadata: { label: 'Booking Agency' },
      }),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result[0]).not.toHaveProperty('editStatus');
    expect(result[0]).not.toHaveProperty('teaserMetadata');
  });

  it('preserves relations of different types', () => {
    const existing = [
      rel('hasTag', 'TAG-001'),
      rel('refOrganizations', 'BA-001'),
    ];
    const formRelations = [
      formRel('refOrganizations', 'CO-002', EditStatus.New),
    ];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(3);
    const types = result.map((r) => r.type);
    expect(types).toContain('hasTag');
    expect(types.filter((t) => t === 'refOrganizations')).toHaveLength(2);
  });

  it('does nothing when form has no relations', () => {
    const existing = [rel('refOrganizations', 'BA-001')];
    const formRelations: any[] = [];
    const result = buildMergedRelations(formRelations, existing);
    expect(result).toHaveLength(1);
  });

  it('keeps non-deleted when existing is empty (frontend-driven delete, PUT path)', () => {
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.Unchanged),
      formRel('refOrganizations', 'CO-002', EditStatus.Deleted),
    ];
    const result = buildMergedRelations(formRelations, []);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('BA-001');
    expect(result[0]).not.toHaveProperty('editStatus');
  });

  it('returns all stripped relations when no deletions (PATCH path with empty existing)', () => {
    const formRelations = [
      formRel('refOrganizations', 'BA-001', EditStatus.New),
      formRel('refOrganizations', 'CO-002', EditStatus.Changed),
    ];
    const result = buildMergedRelations(formRelations, []);
    expect(result).toHaveLength(2);
    result.forEach((r) => expect(r).not.toHaveProperty('editStatus'));
  });
});
