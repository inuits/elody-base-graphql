export type MetadataItem = { key: string; value: any };

export const evaluateMetadataConditions = (
  metadata: MetadataItem[] = [],
  expressions: string[] = []
): boolean => {
if (!expressions || expressions.length === 0) return false;

  const isPresent = (key: string): boolean => {
    const item = metadata.find((m) => m.key === key);
    return !!(item && item.value !== null && item.value !== undefined && item.value !== '');
  };

  const evaluateSingle = (cond: string): boolean => {
    const trimmed = cond.trim();
    const isNegated = trimmed.startsWith('!');
    const targetKey = isNegated ? trimmed.substring(1) : trimmed;
    const exists = isPresent(targetKey);
    return isNegated ? !exists : exists;
  };

  return expressions.some((expression) => {
    if (!expression) return false;

    const orParts = expression.split('|');
    return orParts.some((orPart) => {

      if (orPart.includes('&')) {
        const andParts = orPart.split('&');
        return andParts.every((andPart) => evaluateSingle(andPart));
      }

      return evaluateSingle(orPart);
    });
  });
};
