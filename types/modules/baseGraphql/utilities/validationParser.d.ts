import { ValidationRules, RequiredRelationValidationInput, RequiredOneOfRelationValidationInput, RequiredOneOfMetadataValidationInput, ConditionalInput } from '../../../generated-types/type-defs';
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
export declare const parseValidationRulesString: (rulesString: string) => ParsedValidationRules;
