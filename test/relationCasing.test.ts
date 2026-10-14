import { expect, test, describe } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import {
  findCamelCaseRelations,
  assertSnakeCaseRelations,
} from '../helpers/relationCasing';

describe('findCamelCaseRelations', () => {
  test.each([
    ['relationType: "refGenres",', 'refGenres'],
    ["relationKey: 'hasAsset',", 'hasAsset'],
    ['fromRelationType: "isAssetFor",', 'isAssetFor'],
    [
      'production: keyValue(key: "refProduction", source: relations)',
      'refProduction',
    ],
    ['key: "relations.isIn._to",', 'isIn'],
    ['local_field: "relations.hasMediafile.key",', 'hasMediafile'],
    ['const subject = "relationValues.refSubject";', 'refSubject'],
    ['formRelationType: "refProductions"', 'refProductions'],
    ['key(input: "refOrganization")', 'refOrganization'],
    ['relations: [{ key: "", type: "refUsers" }],', 'refUsers'],
    ['value: "$refVenues",', 'refVenues'],
    [
      'rules: "has_required_relation:relationType=refCompanies,amount=1"',
      'refCompanies',
    ],
  ])('flags %s', (line, value) => {
    expect(findCamelCaseRelations(line)).toEqual([{ line: 1, value }]);
  });

  test.each([
    'relationType: "ref_genres",',
    'keyValue(key: "ref_production", source: relations)',
    'local_field: "relations.has_mediafile.key",',
    'keyValue(key: "titleNl", source: metadata)',
    'local_field: "properties.ref_language.value",',
  ])('passes %s', (line) => {
    expect(findCamelCaseRelations(line)).toEqual([]);
  });

  test('skips allowlisted values', () => {
    expect(
      findCamelCaseRelations('relationType: "hasTenant",', ['hasTenant'])
    ).toEqual([]);
  });

  test('reports the line number', () => {
    expect(
      findCamelCaseRelations('a\nb\n  relationType: "refVenues",')
    ).toEqual([{ line: 3, value: 'refVenues' }]);
  });
});

describe('assertSnakeCaseRelations', () => {
  const makeSrc = (files: Record<string, string>) => {
    const srcDir = mkdtempSync(path.join(tmpdir(), 'relation-casing-'));
    for (const [file, content] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(srcDir, file)), { recursive: true });
      writeFileSync(path.join(srcDir, file), content);
    }
    return srcDir;
  };

  test('passes a snake_case source tree', () => {
    const srcDir = makeSrc({ 'sources/forms.ts': 'relationType: "ref_x",' });
    expect(() => assertSnakeCaseRelations(srcDir)).not.toThrow();
  });

  test('lists every offending file:line: value', () => {
    const srcDir = makeSrc({
      'sources/forms.ts': 'relationType: "refX",',
      'queries/a.queries.ts': 'x\nkeyValue(key: "hasY", source: relations)',
    });
    expect(() => assertSnakeCaseRelations(srcDir)).toThrow(
      'sources/forms.ts:1: refX'
    );
    expect(() => assertSnakeCaseRelations(srcDir)).toThrow(
      'queries/a.queries.ts:2: hasY'
    );
  });

  test('ignores generated-types and non-ts files', () => {
    const srcDir = makeSrc({
      'generated-types/type-defs.ts': 'relationType: "refX",',
      'notes.md': 'relationType: "refX",',
    });
    expect(() => assertSnakeCaseRelations(srcDir)).not.toThrow();
  });

  test('honours the allow list', () => {
    const srcDir = makeSrc({ 'forms.ts': 'relationType: "hasTenant",' });
    expect(() =>
      assertSnakeCaseRelations(srcDir, { allow: ['hasTenant'] })
    ).not.toThrow();
  });
});
