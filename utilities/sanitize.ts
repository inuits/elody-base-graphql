import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const purify = DOMPurify(new JSDOM('').window);

const PURIFY_CONFIG = {
  FORBID_TAGS: ['style'],
  CUSTOM_ELEMENT_HANDLING: {
    tagNameCheck: /^elody-/,
    attributeNameCheck: /^(?!on)/,
    allowCustomizedBuiltInElements: false,
  },
};

const DANGEROUS_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'frame',
  'frameset',
  'object',
  'embed',
  'base',
  'link',
  'meta',
]);
const DANGEROUS_URL = /^(javascript|vbscript|data:text\/html)/i;

let foundDangerousMarkup = false;

// DOMPurify also rewrites harmless text ("x < 5", AICAP's elody-* tags), so its
// output is only used when the input actually contains something dangerous.
purify.addHook('uponSanitizeElement', (node: any, data) => {
  if (DANGEROUS_TAGS.has(data.tagName)) foundDangerousMarkup = true;
  for (const attribute of Array.from(node.attributes || []) as Attr[]) {
    const name = attribute.name.toLowerCase();
    const value = attribute.value.replace(/[\s\u0000-\u001f]/g, '');
    if (name.startsWith('on') || name === 'srcdoc' || DANGEROUS_URL.test(value))
      foundDangerousMarkup = true;
  }
});

const sanitizeString = (value: string): string => {
  if (!value.includes('<')) return value;
  foundDangerousMarkup = false;
  const sanitized = purify.sanitize(value, PURIFY_CONFIG) as string;
  return foundDangerousMarkup ? sanitized : value;
};

export const deepSanitize = (value: any): any => {
  if (typeof value === 'string') return sanitizeString(value);

  if (Array.isArray(value)) return value.map(deepSanitize);

  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const sanitizedObj: any = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitizedObj[key] = deepSanitize(value[key]);
      }
    }
    return sanitizedObj;
  }

  return value;
};

export const sanitizeGraphqlVariables = (req: any, _res: any, next: any) => {
  if (req.body?.variables)
    req.body.variables = deepSanitize(req.body.variables);
  next();
};
