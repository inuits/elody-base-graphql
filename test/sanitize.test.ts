import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deepSanitize, sanitizeRequestBody } from '../utilities/sanitize';

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

describe('sanitizeRequestBody', () => {
  let req: any;
  let res: any;
  let next: any;
  beforeEach(() => {
    req = {};
    res = {};
    next = vi.fn();
  });

  describe('when a request contains a body', () => {
    it('sanitizes the req.body object', () => {
      req.body = {
        comment: 'This is a <script>alert("XSS")</script> comment.',
        author: 'User',
      };

      sanitizeRequestBody(req, res, next);

      expect(req.body.comment).toBe('This is a  comment.');
      expect(req.body.author).toBe('User');
    });
  });

  describe('when a request contains query parameters', () => {
    it('sanitizes the req.query object', () => {
      req.query = {
        search: 'looking for <img src=x onerror=alert(1)>',
        filter: 'all',
      };

      sanitizeRequestBody(req, res, next);

      expect(req.query.search).toBe('looking for <img src="x">');
      expect(req.query.filter).toBe('all');
    });
  });

  describe('when a request contains both body and query', () => {
    it('sanitizes both req.body and req.query', () => {
      req.body = { content: '<p onload="danger()">Hello</p>' };
      req.query = { redirect: 'Click <a href="javascript:alert(\'bad\')">here</a>' };

      sanitizeRequestBody(req, res, next);

      expect(req.body.content).toBe('<p>Hello</p>');
      expect(req.query.redirect).toBe('Click <a>here</a>');
    });
  });

  describe('when a request has no body or query', () => {
    it('does not modify the request object', () => {
      const originalReq = {};
      req = { ...originalReq };

      sanitizeRequestBody(req, res, next);

      expect(req).toEqual(originalReq);
    });
  });

  describe('middleware behavior', () => {
    it('always calls the next middleware function exactly once', () => {
      sanitizeRequestBody(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
