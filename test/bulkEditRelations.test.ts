import { describe, expect, it } from 'vitest';
import { buildRelationsAfterBulkEdit } from '../helpers/helpers';

const existing = [
  { type: 'refAuthors', key: 'person-1' },
  { type: 'refAuthors', key: 'person-2' },
  { type: 'refOtherGenres', key: 'genre-1' },
  { type: 'refLanguages', key: 'lang-nl' },
];

describe('buildRelationsAfterBulkEdit', () => {
  it('removes only the named type/key pairs', () => {
    const result = buildRelationsAfterBulkEdit(existing, {
      relationsToRemove: [{ type: 'refAuthors', key: 'person-2' }],
      relationsToReplace: [],
    });

    expect(result).toEqual([
      { type: 'refAuthors', key: 'person-1' },
      { type: 'refOtherGenres', key: 'genre-1' },
      { type: 'refLanguages', key: 'lang-nl' },
    ]);
  });

  it('leaves an entity untouched when it does not have the relation to remove', () => {
    const result = buildRelationsAfterBulkEdit(existing, {
      relationsToRemove: [{ type: 'refOtherGenres', key: 'genre-unknown' }],
      relationsToReplace: [],
    });

    expect(result).toEqual(existing);
  });

  it('replaces every relation of the named types only', () => {
    const result = buildRelationsAfterBulkEdit(existing, {
      relationsToRemove: [],
      relationsToReplace: [{ type: 'refAuthors', key: 'person-9' }],
    });

    expect(result).toEqual([
      { type: 'refOtherGenres', key: 'genre-1' },
      { type: 'refLanguages', key: 'lang-nl' },
      { type: 'refAuthors', key: 'person-9' },
    ]);
  });

  it('never emits duplicates and strips editStatus/teaserMetadata', () => {
    const result = buildRelationsAfterBulkEdit(existing, {
      relationsToRemove: [],
      relationsToReplace: [
        {
          type: 'refOtherGenres',
          key: 'genre-1',
          editStatus: 'new',
          teaserMetadata: { anything: true },
        } as any,
      ],
    });

    expect(result).toEqual([
      { type: 'refAuthors', key: 'person-1' },
      { type: 'refAuthors', key: 'person-2' },
      { type: 'refLanguages', key: 'lang-nl' },
      { type: 'refOtherGenres', key: 'genre-1' },
    ]);
  });

  it('combines remove and replace in one pass', () => {
    const result = buildRelationsAfterBulkEdit(existing, {
      relationsToRemove: [{ type: 'refAuthors', key: 'person-1' }],
      relationsToReplace: [{ type: 'refLanguages', key: 'lang-fr' }],
    });

    expect(result).toEqual([
      { type: 'refAuthors', key: 'person-2' },
      { type: 'refOtherGenres', key: 'genre-1' },
      { type: 'refLanguages', key: 'lang-fr' },
    ]);
  });
});
