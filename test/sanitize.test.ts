import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deepSanitize, sanitizeGraphqlVariables } from '../utilities/sanitize';

describe('deepSanitize', () => {
  describe('when given a primitive string', () => {
    it('removes malicious HTML attributes from the string', () => {
      const dirty = '<p style="color: red;" onload="alert(\'XSS\')">Hello</p>';
      const clean = '<p style="color: red;">Hello</p>';
      expect(deepSanitize(dirty)).toBe(clean);
    });

    it('removes entire malicious tags like <script>', () => {
      const dirty = 'Safe text <script>alert("pwned")</script>';
      const clean = 'Safe text ';
      expect(deepSanitize(dirty)).toBe(clean);
    });

    it('leaves a clean string unchanged', () => {
      const cleanString = 'This is a perfectly safe string.';
      expect(deepSanitize(cleanString)).toBe(cleanString);
    });
  });

  describe('when given an array', () => {
    it('sanitizes each string element in a flat array', () => {
      const dirtyArray = ['clean', 'another clean', '<img src=x onerror=alert(1)>'];
      const cleanArray = ['clean', 'another clean', '<img src="x">'];
      expect(deepSanitize(dirtyArray)).toStrictEqual(cleanArray);
    });

    it('recursively sanitizes elements in a nested array', () => {
      const dirtyArray = [
        'level 1 clean',
        ['level 2 clean', '<a href="javascript:alert(1)">click me</a>'],
      ];
      const cleanArray = ['level 1 clean', ['level 2 clean', '<a>click me</a>']];
      expect(deepSanitize(dirtyArray)).toStrictEqual(cleanArray);
    });

    it('sanitizes style from a string', () => {
      const dirty = 'a note with <style>*{display:none}</style>';
      const clean = 'a note with ';
      expect(deepSanitize(dirty)).toBe(clean);
    });

    it('handles an array with mixed data types', () => {
      const now = new Date();
      const dirtyMixedArray = [
        123,
        '<b>bold</b> <iframe src="https://evil.com"></iframe>',
        true,
        null,
        {
          note: 'a note with <style>*{display:none}</style>',
        },
        now,
      ];      const cleanMixedArray = [
        123,
        '<b>bold</b> ',
        true,
        null,
        {
          note: 'a note with ',
        },
        now,
      ];
      expect(deepSanitize(dirtyMixedArray)).toStrictEqual(cleanMixedArray);
    });
  });

  describe('when given an object', () => {
    it('sanitizes each string property in a flat object', () => {
      const dirtyObject = {
        name: 'John Doe',
        bio: 'A developer who loves <script>HTML</script>.',
      };
      const cleanObject = {
        name: 'John Doe',
        bio: 'A developer who loves .',
      };
      expect(deepSanitize(dirtyObject)).toStrictEqual(cleanObject);
    });

    it('recursively sanitizes properties in a nested object', () => {
      const dirtyObject = {
        user: {
          id: 1,
          profile: {
            description: 'My profile <script>doEvil()</script>',
            website: 'https://safe.com',
          },
        },
        isActive: true,
      };
      const cleanObject = {
        user: {
          id: 1,
          profile: {
            description: 'My profile ',
            website: 'https://safe.com',
          },
        },
        isActive: true,
      };
      expect(deepSanitize(dirtyObject)).toEqual(cleanObject);
    });
  });

  describe('when the string holds no dangerous markup', () => {
    it.each([
      ['a comparison', 'x < 5 and y > 3'],
      ['an unclosed angle bracket', 'pa<ss&word'],
      ['an ampersand', 'Tom & Jerry'],
      ['a JSON string', '{"a":"<b>"}'],
      [
        'an AICAP word tag',
        '<p>Hi <elody-w type="word" lemma="rex" data-entity-id="abc">regis</elody-w></p>',
      ],
    ])('returns %s byte for byte', (_label, value) => {
      expect(deepSanitize(value)).toBe(value);
    });
  });

  describe('when the string holds dangerous markup', () => {
    it('keeps AICAP word tags while removing the script', () => {
      const dirty =
        '<p><elody-w type="word" lemma="rex" onclick="x()">regis</elody-w><script>x</script></p>';
      expect(deepSanitize(dirty)).toBe(
        '<p><elody-w type="word" lemma="rex">regis</elody-w></p>'
      );
    });

    it('removes a javascript: URL hidden behind whitespace', () => {
      expect(deepSanitize('<a href=" java\tscript:alert(1)">c</a>')).toBe(
        '<a>c</a>'
      );
    });

    it('removes an event handler on an unknown element', () => {
      expect(deepSanitize('<foo onclick=alert(1)>t</foo>')).toBe('t');
    });
  });

  describe('when given edge cases', () => {
    it('returns null when given null', () => {
      expect(deepSanitize(null)).toBeNull();
    });

    it('returns undefined when given undefined', () => {
      expect(deepSanitize(undefined)).toBeUndefined();
    });

    it('returns the same number when given a number', () => {
      expect(deepSanitize(42)).toBe(42);
      expect(deepSanitize(0)).toBe(0);
      expect(deepSanitize(-3.14)).toBe(-3.14);
    });

    it('returns the same boolean when given a boolean', () => {
      expect(deepSanitize(true)).toBe(true);
      expect(deepSanitize(false)).toBe(false);
    });

    it('returns the same Date object when given a Date object', () => {
      const date = new Date();
      expect(deepSanitize(date)).toEqual(date);
    });

    it('returns an empty object when given an empty object', () => {
      expect(deepSanitize({})).toEqual({});
    });

    it('returns an empty array when given an empty array', () => {
      expect(deepSanitize([])).toEqual([]);
    });
  });
});

describe('sanitizeGraphqlVariables', () => {
  const next = vi.fn();
  beforeEach(() => next.mockClear());

  it('sanitizes the GraphQL variables', () => {
    const req: any = {
      body: { variables: { comment: 'a <script>alert(1)</script>b' } },
    };
    sanitizeGraphqlVariables(req, {}, next);
    expect(req.body.variables.comment).toBe('a b');
  });

  it('leaves the query text and other body fields alone', () => {
    const query = 'query Q { a(where: "<script>") }';
    const req: any = {
      body: { query, operationName: 'Q', variables: { a: 'x < 5' } },
    };
    sanitizeGraphqlVariables(req, {}, next);
    expect(req.body).toEqual({
      query,
      operationName: 'Q',
      variables: { a: 'x < 5' },
    });
  });

  it('passes requests without variables through', () => {
    const req: any = { query: { q: '<script>' } };
    sanitizeGraphqlVariables(req, {}, next);
    expect(req).toEqual({ query: { q: '<script>' } });
  });

  it('calls next exactly once', () => {
    sanitizeGraphqlVariables({ body: {} }, {}, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
