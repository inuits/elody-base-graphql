export const substitutePermissionPlaceholders = (
  permissionRequestInfo: unknown,
  parentEntityId?: string | null,
  childEntityId?: string | null,
  queryVariables: Record<string, unknown> = {}
): string => {
  let substituted = JSON.stringify(permissionRequestInfo);
  if (parentEntityId)
    substituted = substituted.replace(/\$parentEntityId/g, parentEntityId);
  if (childEntityId)
    substituted = substituted.replace(/\$childEntityId/g, childEntityId);
  for (const [name, value] of Object.entries(queryVariables)) {
    if (typeof value !== 'string' || !value) continue;
    // Anchored so a variable named `user` cannot eat the `$userUuid` of another.
    substituted = substituted.replace(
      new RegExp(`\\$${name}(?![A-Za-z0-9_])`, 'g'),
      value
    );
  }
  return substituted;
};
