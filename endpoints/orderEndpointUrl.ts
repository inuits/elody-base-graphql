export const orderEndpointUrl = (
  collectionApiUrl: string,
  parentId: string,
  parameters: Record<string, string | undefined>
): string => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(parameters))
    if (value) query.set(key, value);
  const baseUrl = collectionApiUrl.replace(/\/$/, '');
  return `${baseUrl}/entities/${encodeURIComponent(parentId)}/order?${query}`;
};
