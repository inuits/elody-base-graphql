import { parseValidationRulesString } from '../utilities/validationParser';
import { ValidationRules } from '../../../generated-types/type-defs';
import { describe, it, expect } from 'vitest';

describe('ValidationParser', () => {
  describe('parseValidationRulesString', () => {
    it('should parse simple rules correctly', () => {
      const result = parseValidationRulesString('required|alpha|email');
      expect(result.value).toContain(ValidationRules.Required);
      expect(result.value).toContain(ValidationRules.Alpha);
      expect(result.value).toContain(ValidationRules.Email);
    });

    it('should parse regex rules correctly', () => {
      const result = parseValidationRulesString('regex:/^(?=.{1,20}$)[a-zA-Z0-9._-]+$/');
      expect(result.value).toContain(ValidationRules.Regex);
      expect(result.regex).toBe('/^(?=.{1,20}$)[a-zA-Z0-9._-]+$/');
    });

    it('should parse complex regex with pipe characters', () => {
      const result = parseValidationRulesString('regex:/^(option1|option2|option3)$/');
      expect(result.value).toContain(ValidationRules.Regex);
      expect(result.regex).toBe('/^(option1|option2|option3)$/');
    });

    it('should parse custom value rules', () => {
      const result = parseValidationRulesString('customValue:someValue|required');
      expect(result.value).toContain(ValidationRules.CustomValue);
      expect(result.value).toContain(ValidationRules.Required);
      expect(result.customValue).toBe('someValue');
    });

    it('should parse message rules', () => {
      const result = parseValidationRulesString('required|message:Custom error message');
      expect(result.value).toContain(ValidationRules.Required);
      expect(result.fastValidationMessage).toBe('Custom error message');
    });

    it('should handle empty or invalid input', () => {
      expect(parseValidationRulesString('')).toEqual({ value: [] });
      expect(parseValidationRulesString(null as any)).toEqual({ value: [] });
      expect(parseValidationRulesString(undefined as any)).toEqual({ value: [] });
    });
  });

  describe('Integration with resolver', () => {
    it('should simulate resolver behavior', () => {
      const inputWithRules = {
        rules: 'required|alpha|regex:/^(?=.{1,20}$)[a-zA-Z0-9._-]+$/'
      };

      const parsed = parseValidationRulesString(inputWithRules.rules);

      const resolverResult = {
        value: parsed.value,
        customValue: parsed.customValue,
        regex: parsed.regex,
        fastValidationMessage: parsed.fastValidationMessage,
      };

      expect(resolverResult.value).toContain(ValidationRules.Required);
      expect(resolverResult.value).toContain(ValidationRules.Alpha);
      expect(resolverResult.value).toContain(ValidationRules.Regex);
      expect(resolverResult.regex).toBe('/^(?=.{1,20}$)[a-zA-Z0-9._-]+$/');
    });


    it('should simulate resolver behavior', () => {
      const inputWithRules = {
        rules: 'required|alpha|message:We already know it,|regex:/^(?=.{1,20}$)[a-zA-Z0-9._-]+$/'
      };

      const parsed = parseValidationRulesString(inputWithRules.rules);

      const resolverResult = {
        value: parsed.value,
        customValue: parsed.customValue,
        regex: parsed.regex,
        fastValidationMessage: parsed.fastValidationMessage,
      };

      expect(resolverResult.value).toContain(ValidationRules.Required);
      expect(resolverResult.value).toContain(ValidationRules.Alpha);
      expect(resolverResult.value).toContain(ValidationRules.Regex);
      expect(resolverResult.regex).toBe('/^(?=.{1,20}$)[a-zA-Z0-9._-]+$/');
      expect(resolverResult.fastValidationMessage).toBe('We already know it,');
    });

    it('should simulate resolver behavior', () => {
      const inputWithRules = {
        rules: 'required|regex:/^(?=.{1,20}$)[a-zA-Z0-9._-]+$/|has_required_relation:hasMedia,1,true'
      };

      const parsed = parseValidationRulesString(inputWithRules.rules);

      expect(parsed).toEqual({
        value: ["required", "regex", "has_required_relation"],
        customValue: null,
        fastValidationMessage: null,
        required_if: null,
        available_if: null,
        has_required_relation: {
          relationType: "hasMedia",
          amount: 1,
          exact: true
        },
        has_one_of_required_relations: null,
        has_one_of_required_metadata: null,
        regex: "/^(?=.{1,20}$)[a-zA-Z0-9._-]+$/"
      });
    });
  });
});

describe('ValidationParser - Complex Validation Objects', () => {
  describe('Conditional parsing (required_if, available_if)', () => {
    it('should parse required_if with field and value', () => {
      const result = parseValidationRulesString('required_if:field=status,value=active');
      expect(result.required_if).toEqual({
        field: 'status',
        value: 'active',
        ifAnyValue: false
      });
    });

    it('should parse required_if with field only (ifAnyValue=true)', () => {
      const result = parseValidationRulesString('required_if:fieldName');
      expect(result.required_if).toEqual({
        field: 'fieldName',
        ifAnyValue: true
      });
    });

    it('should parse required_if with explicit ifAnyValue', () => {
      const result = parseValidationRulesString('required_if:field=status,ifAnyValue=true');
      expect(result.required_if).toEqual({
        field: 'status',
        ifAnyValue: true
      });
    });

    it('should parse available_if with field and value', () => {
      const result = parseValidationRulesString('available_if:field=type,value=editable');
      expect(result.available_if).toEqual({
        field: 'type',
        value: 'editable',
        ifAnyValue: false
      });
    });

    it('should return null for invalid conditional format', () => {
      const result = parseValidationRulesString('required_if:invalid');
      expect(result.required_if).toBeNull();
    });
  });

  describe('RequiredRelationValidation parsing (has_required_relation)', () => {
    it('should parse has_required_relation with new format', () => {
      const result = parseValidationRulesString('has_required_relation:relationType=parent,amount=2,exact=true');
      expect(result.has_required_relation).toEqual({
        relationType: 'parent',
        amount: 2,
        exact: true
      });
      expect(result.value).toContain(ValidationRules.HasRequiredRelation);
    });

    it('should parse has_required_relation with minimal properties', () => {
      const result = parseValidationRulesString('has_required_relation:relationType=child,amount=1');
      expect(result.has_required_relation).toEqual({
        relationType: 'child',
        amount: 1
      });
    });

    it('should parse has_required_relation with legacy format', () => {
      const result = parseValidationRulesString('has_required_relation:hasMedia,1,true');
      expect(result.has_required_relation).toEqual({
        relationType: 'hasMedia',
        amount: 1,
        exact: true
      });
      expect(result.value).toContain(ValidationRules.HasRequiredRelation);
    });

    it('should return null for invalid relation format', () => {
      const result = parseValidationRulesString('has_required_relation:invalid');
      expect(result.has_required_relation).toBeNull();
    });
  });

  describe('RequiredOneOfRelationValidation parsing (has_one_of_required_relations)', () => {
    it('should parse has_one_of_required_relations', () => {
      const result = parseValidationRulesString('has_one_of_required_relations:relationTypes=[parent,child,sibling],amount=1');
      expect(result.has_one_of_required_relations).toEqual({
        relationTypes: ['parent', 'child', 'sibling'],
        amount: 1
      });
      expect(result.value).toContain(ValidationRules.HasOneOfRequiredRelations);
    });

    it('should parse has_one_of_required_relations with single type', () => {
      const result = parseValidationRulesString('has_one_of_required_relations:relationTypes=[parent],amount=2');
      expect(result.has_one_of_required_relations).toEqual({
        relationTypes: ['parent'],
        amount: 2
      });
    });

    it('should return null for invalid one of relations format', () => {
      const result = parseValidationRulesString('has_one_of_required_relations:invalid');
      expect(result.has_one_of_required_relations).toBeNull();
    });
  });

  describe('RequiredOneOfMetadataValidation parsing (has_one_of_required_metadata)', () => {
    it('should parse has_one_of_required_metadata', () => {
      const result = parseValidationRulesString('has_one_of_required_metadata:includedMetadataFields=[title,description,keywords],amount=2');
      expect(result.has_one_of_required_metadata).toEqual({
        includedMetadataFields: ['title', 'description', 'keywords'],
        amount: 2
      });
      expect(result.value).toContain(ValidationRules.HasOneOfRequiredMetadata);
    });

    it('should parse has_one_of_required_metadata with single field', () => {
      const result = parseValidationRulesString('has_one_of_required_metadata:includedMetadataFields=[title],amount=1');
      expect(result.has_one_of_required_metadata).toEqual({
        includedMetadataFields: ['title'],
        amount: 1
      });
    });

    it('should return null for invalid one of metadata format', () => {
      const result = parseValidationRulesString('has_one_of_required_metadata:invalid');
      expect(result.has_one_of_required_metadata).toBeNull();
    });
  });

  describe('FastValidationMessage and CustomValue', () => {
    it('should parse fastValidationMessage with message rule', () => {
      const result = parseValidationRulesString('required|message:This field is required');
      expect(result.fastValidationMessage).toBe('This field is required');
      expect(result.value).toContain(ValidationRules.Required);
    });

    it('should parse fastValidationMessage with fastValidationMessage rule', () => {
      const result = parseValidationRulesString('required|fastValidationMessage:Custom error');
      expect(result.fastValidationMessage).toBe('Custom error');
      expect(result.value).toContain(ValidationRules.Required);
    });

    it('should parse customValue', () => {
      const result = parseValidationRulesString('customValue:testValue|required');
      expect(result.customValue).toBe('testValue');
      expect(result.value).toContain(ValidationRules.CustomValue);
      expect(result.value).toContain(ValidationRules.Required);
    });
  });

  describe('Combined rules with complex validations', () => {
    it('should parse multiple rules including complex validations', () => {
      const rulesString = 'required|alpha|required_if:field=status,value=active|has_required_relation:relationType=parent,amount=1';
      const result = parseValidationRulesString(rulesString);
      
      expect(result.value).toContain(ValidationRules.Required);
      expect(result.value).toContain(ValidationRules.Alpha);
      expect(result.value).toContain(ValidationRules.HasRequiredRelation);
      expect(result.required_if).toEqual({
        field: 'status',
        value: 'active',
        ifAnyValue: false
      });
      expect(result.has_required_relation).toEqual({
        relationType: 'parent',
        amount: 1
      });
    });

    it('should maintain null values for unused properties', () => {
      const result = parseValidationRulesString('required|customValue:test');
      
      expect(result.value).toContain(ValidationRules.Required);
      expect(result.value).toContain(ValidationRules.CustomValue);
      expect(result.customValue).toBe('test');
      expect(result.fastValidationMessage).toBeNull();
      expect(result.required_if).toBeNull();
      expect(result.available_if).toBeNull();
      expect(result.has_required_relation).toBeNull();
      expect(result.has_one_of_required_relations).toBeNull();
      expect(result.has_one_of_required_metadata).toBeNull();
      expect(result.regex).toBeNull();
    });
  });
});