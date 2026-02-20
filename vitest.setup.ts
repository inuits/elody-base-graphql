import { vi } from 'vitest';

vi.mock('@/types', async () => {
  return await import('./__mock__/types');
});
