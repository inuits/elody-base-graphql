import { describe, it, expect } from 'vitest';
import { print } from 'graphql';
import { baseResolver } from '../baseModule/baseResolver';
import { baseSchema } from '../baseModule/baseSchema.schema';

// SHACL 1.2 UI property groups in a create form: a titled section around
// the form fields of one sh:PropertyGroup.
describe('FormSection', () => {
  const schema = typeof baseSchema === 'string' ? baseSchema : print(baseSchema as any);

  it('is a form field kind next to metaData, uploadContainer and action', () => {
    expect(schema).toMatch(/type FormFields \{[\s\S]*?formSection: FormSection/);
    expect(schema).toMatch(/type FormSection \{[\s\S]*?label\(input: String\): String![\s\S]*?formFields: FormFields!/);
  });

  it('resolves to itself, so its fields are aliased like a form tab\'s', async () => {
    const parent = {};
    expect(await (baseResolver.FormFields as any).formSection(parent, {}, {})).toBe(parent);
    expect(await (baseResolver.FormSection as any).formFields(parent, {}, {})).toBe(parent);
  });

  it('returns its label', async () => {
    expect(await (baseResolver.FormSection as any).label({}, { input: 'ui.person.group.name' }, {})).toBe('ui.person.group.name');
    expect(await (baseResolver.FormSection as any).label({}, {}, {})).toBe('');
  });
});
