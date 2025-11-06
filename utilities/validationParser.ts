import { ValidationRules, 
  RequiredRelationValidationInput,
  RequiredOneOfRelationValidationInput,
  RequiredOneOfMetadataValidationInput,
  ConditionalInput,
} from '../../../generated-types/type-defs';

export interface ParsedValidationRules {
  value: ValidationRules[];
  customValue?: string | null;
  fastValidationMessage?: string | null;
  required_if?: ConditionalInput | null;
  available_if?: ConditionalInput | null;
  has_required_relation?: RequiredRelationValidationInput | null;
  has_one_of_required_relations?: RequiredOneOfRelationValidationInput | null;
  has_one_of_required_metadata?: RequiredOneOfMetadataValidationInput | null;
  regex?: string | null;
}

export const parseValidationRulesString = (rulesString: string): ParsedValidationRules => {
  if (!rulesString || typeof rulesString !== 'string') {
    return { value: [] };
  }

  const rules: ValidationRules[] = [];
  const result: ParsedValidationRules = { 
    value: rules,
    customValue: null,
    fastValidationMessage: null,
    required_if: null,
    available_if: null,
    has_required_relation: null,
    has_one_of_required_relations: null,
    has_one_of_required_metadata: null,
    regex: null
  };
  
  const parts = splitRulesString(rulesString);
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    if (trimmedPart.startsWith('regex:')) {
      const regexPart = trimmedPart.substring(6);
      result.regex = regexPart;
      rules.push(ValidationRules.Regex);
    } else if (trimmedPart.includes(':')) {
      const colonIndex = trimmedPart.indexOf(':');
      const ruleName = trimmedPart.substring(0, colonIndex);
      const params = trimmedPart.substring(colonIndex + 1);
      
      switch (ruleName.toLowerCase()) {  
        case 'customvalue':
          result.customValue = params;
          rules.push(ValidationRules.CustomValue);
          break;
          
        case 'fastvalidationmessage':
        case 'message':
          result.fastValidationMessage = params;
          break;
          
        case 'required_if':
          result.required_if = parseConditional(params);
          break;
          
        case 'available_if':
          result.available_if = parseConditional(params);
          break;
          
        case 'has_required_relation':
          result.has_required_relation = parseRequiredRelationValidation(params);
          if (result.has_required_relation) {
            rules.push(ValidationRules.HasRequiredRelation);
          }
          break;
          
        case 'has_one_of_required_relations':
          result.has_one_of_required_relations = parseRequiredOneOfRelationValidation(params);
          if (result.has_one_of_required_relations) {
            rules.push(ValidationRules.HasOneOfRequiredRelations);
          }
          break;
          
        case 'has_one_of_required_metadata':
          result.has_one_of_required_metadata = parseRequiredOneOfMetadataValidation(params);
          if (result.has_one_of_required_metadata) {
            rules.push(ValidationRules.HasOneOfRequiredMetadata);
          }
          break;
          
        default:
          const enumValue = mapStringToValidationRule(ruleName);
          if (enumValue) {
            rules.push(enumValue);
          }
      }
    } else {
      const enumValue = mapStringToValidationRule(trimmedPart);
      if (enumValue) {
        rules.push(enumValue);
      }
    }
  }
  
  return result;
}

const splitRulesString = (rulesString: string): string[] => {
  if (!rulesString) return [];
  
  const [sanitizedString, placeholderMap] = isolateRegexRules(rulesString);  
  const parts = sanitizedString.split('|').map(part => part.trim()).filter(part => part.length > 0);
  
  return parts.map(part => {
    let restoredPart = part;
    for (const [placeholder, originalRegex] of placeholderMap) {
      restoredPart = restoredPart.replace(placeholder, originalRegex);
    }
    return restoredPart;
  });
}

const REGEX_RULE_PATTERN = /regex:([\/\#\@\!\^\~])(?:[^\\]|\\.)*?\1/g;
const PLACEHOLDER_PREFIX = '__REGEX_PLACEHOLDER_';

const isolateRegexRules = (rulesString: string): [string, Map<string, string>] => {
  const placeholderMap = new Map<string, string>();
  let placeholderIndex = 0;

  const sanitizedString = rulesString.replace(REGEX_RULE_PATTERN, (match) => {
    const placeholder = `${PLACEHOLDER_PREFIX}${placeholderIndex++}`;
    placeholderMap.set(placeholder, match);
    return placeholder;
  });

  return [sanitizedString, placeholderMap];
};

const parseConditional = (params: string): ConditionalInput | null => {
  try {
    // Expected formats: 
    // 1. "field=value" or "field=value,ifAnyValue=true" 
    // 2. "fieldName" (which means ifAnyValue=true)
    // 3. "field=fieldName,value=someValue,ifAnyValue=false"
    
    if (!params || params.trim() === 'invalid') {
      return null;
    }
    
    const parts = params.split(',').map(p => p.trim());
    const result: ConditionalInput = {
      field: '',
      ifAnyValue: false
    };

    let hasValidField = false;

    for (const part of parts) {
      if (part.includes('=')) {
        const [key, value] = part.split('=', 2);
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        
        if (trimmedKey === 'field') {
          result.field = trimmedValue;
          hasValidField = true;
        } else if (trimmedKey === 'value') {
          result.value = trimmedValue;
        } else if (trimmedKey === 'ifAnyValue') {
          result.ifAnyValue = trimmedValue.toLowerCase() === 'true';
        }
      } else {
        if (!hasValidField && part && part !== 'invalid') {
          result.field = part;
          result.ifAnyValue = true;
          hasValidField = true;
        }
      }
    }

    return hasValidField && result.field ? result : null;
  } catch (error) {
    return null;
  }
}

const parseRequiredRelationValidation = (params: string): RequiredRelationValidationInput | null => {
  try {
    // Support two formats:
    // 1. New format: "relationType=type,amount=1,exact=true"
    // 2. Legacy format: "hasMedia,1,true" (relationType, amount, exact)
    
    if (!params || params.trim() === 'invalid' || params.trim() === '') {
      return null;
    }
    
    const parts = params.split(',').map(p => p.trim());
    
    if (parts.length >= 1 && !parts[0].includes('=')) {
      const relationType = parts[0];
      
      if (relationType === 'invalid' || relationType === '') {
        return null;
      }
      
      const result: RequiredRelationValidationInput = {
        relationType: relationType,
        amount: 1
      };
      
      if (parts.length >= 2) {
        const amount = parseInt(parts[1], 10);
        if (!isNaN(amount)) {
          result.amount = amount;
        }
      }
      
      if (parts.length >= 3) {
        result.exact = parts[2].toLowerCase() === 'true';
      }
      
      return result;
    }
    
    const result: RequiredRelationValidationInput = {
      relationType: '',
      amount: 1
    };

    for (const part of parts) {
      const [key, value] = part.split('=', 2);
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      
      if (trimmedKey === 'relationType') {
        result.relationType = trimmedValue;
      } else if (trimmedKey === 'amount') {
        const amount = parseInt(trimmedValue, 10);
        if (!isNaN(amount)) {
          result.amount = amount;
        }
      } else if (trimmedKey === 'exact') {
        result.exact = trimmedValue.toLowerCase() === 'true';
      }
    }

    return result.relationType && result.relationType !== 'invalid' ? result : null;
  } catch (error) {
    return null;
  }
}

const parseRequiredOneOfRelationValidation = (params: string): RequiredOneOfRelationValidationInput | null => {
  try {
    // Expected format: "relationTypes=[type1,type2,type3],amount=1"
    const parts = params.split(',amount=');
    if (parts.length !== 2) return null;

    const relationTypesStr = parts[0].replace('relationTypes=[', '').replace(']', '');
    const amountStr = parts[1];
    
    const relationTypes = relationTypesStr.split(',').map(t => t.trim()).filter(t => t);
    const amount = parseInt(amountStr.trim(), 10);

    if (relationTypes.length > 0 && !isNaN(amount)) {
      return {
        relationTypes,
        amount
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

const parseRequiredOneOfMetadataValidation = (params: string): RequiredOneOfMetadataValidationInput | null => {
  try {
    // Expected format: "includedMetadataFields=[field1,field2,field3],amount=1"
    const parts = params.split(',amount=');
    if (parts.length !== 2) return null;

    const fieldsStr = parts[0].replace('includedMetadataFields=[', '').replace(']', '');
    const amountStr = parts[1];
    
    const includedMetadataFields = fieldsStr.split(',').map(f => f.trim()).filter(f => f);
    const amount = parseInt(amountStr.trim(), 10);

    if (includedMetadataFields.length > 0 && !isNaN(amount)) {
      return {
        includedMetadataFields,
        amount
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

const mapStringToValidationRule = (ruleName: string): ValidationRules | null => {
  const ruleMap: { [key: string]: ValidationRules } = {
    'alpha': ValidationRules.Alpha,
    'alpha_dash': ValidationRules.AlphaDash,
    'alpha_num': ValidationRules.AlphaNum,
    'alpha_spaces': ValidationRules.AlphaSpaces,
    'required': ValidationRules.Required,
    'email': ValidationRules.Email,
    'url': ValidationRules.Url,
    'regex': ValidationRules.Regex,
    'no_xss': ValidationRules.NoXss,
    'existing_date': ValidationRules.ExistingDate,
    'max_date_today': ValidationRules.MaxDateToday,
    'customvalue': ValidationRules.CustomValue,
    'has_required_relation': ValidationRules.HasRequiredRelation,
    'has_one_of_required_relations': ValidationRules.HasOneOfRequiredRelations,
    'has_one_of_required_metadata': ValidationRules.HasOneOfRequiredMetadata,
  };
  
  return ruleMap[ruleName.toLowerCase()] || null;
}