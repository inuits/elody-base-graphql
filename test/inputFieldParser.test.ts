import { parseItemTypesFromInputField } from '../parsers/inputField';
import { expect, test } from 'vitest';
import {
  AdvancedFilterTypes,
  InputField,
  InputFieldTypes,
} from '../../../generated-types/type-defs';
import { Entitytyping } from '../../../clients/generated-types/type-defs';

test('Get item type from input field', () => {
  const inputField: InputField = {
    type: InputFieldTypes.DropdownMultiselect,
    advancedFilterInputForSearchingOptions: {
      type: AdvancedFilterTypes.Text,
      key: ['elody:1|metadata.title.value'],
      value: '*',
      match_exact: false,
      item_types: [Entitytyping.BaseEntity],
    },
  };
  expect(parseItemTypesFromInputField(inputField)).toStrictEqual([
    Entitytyping.BaseEntity,
  ]);
});
