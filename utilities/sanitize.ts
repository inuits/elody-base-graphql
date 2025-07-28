import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export const deepSanitize = (value: any): any =>  {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  if (typeof value === 'string') {
    return purify.sanitize(value, { FORBID_TAGS: ['style'] });
  }

  if (Array.isArray(value)) {
    return value.map(deepSanitize);
  }

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
}

export const sanitizeRequestBody = (req: any, res: any, next: any) =>  {
  if (req.body) req.body = deepSanitize(req.body);
  if (req.query) req.query = deepSanitize(req.query);
  next();
}