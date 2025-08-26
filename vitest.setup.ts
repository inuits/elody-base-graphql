import { vi } from 'vitest';

vi.mock("../../generated-types/type-defs", async () => {
  return await import("./__mock__/types");
});