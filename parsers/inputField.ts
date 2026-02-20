import { Entitytyping, InputField } from '@/types';

export const parseItemTypesFromInputField = (
  inputField: InputField
): string[] | undefined => {
  const filterInputs = inputField.advancedFilterInputForSearchingOptions;
  if (filterInputs) {
    return (filterInputs.item_types as Entitytyping[]) || [];
  }
  return undefined;
};
