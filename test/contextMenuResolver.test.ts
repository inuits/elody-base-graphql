import { describe, it, expect } from 'vitest';
import { evaluateMetadataConditions } from '../resolvers/contextMenuResolver';

describe('evaluateMetadataConditions', () => {
  const mockMetadata = [
    { key: 'status', value: 'firing' },
    { key: 'date_closed', value: '' },
    { key: 'date_issued', value: "05/05/2025" }
  ];

  it('returns true if key exists', () => {
    expect(evaluateMetadataConditions(mockMetadata, ['status'])).toBe(true);
  });

  it('returns false if key is missing', () => {
    expect(evaluateMetadataConditions(mockMetadata, ['missing_key'])).toBe(false);
  });

  it('handles negation (!)', () => {
    expect(evaluateMetadataConditions(mockMetadata, ['!missing_key'])).toBe(true);
  });

  it('treats empty strings as non-existent', () => {
    expect(evaluateMetadataConditions(mockMetadata, ['date_closed'])).toBe(false);
  });

  it('handles AND logic (&)', () => {
    expect(evaluateMetadataConditions(mockMetadata, ['status&!missing_key'])).toBe(true);

    expect(evaluateMetadataConditions(mockMetadata, ['!status_date&!missing_key'])).toBe(true);

    expect(evaluateMetadataConditions(mockMetadata, ['status&date_closed'])).toBe(false);
  });

  it('handles OR logic (|)', () => {
    expect(evaluateMetadataConditions(mockMetadata, ['status|!missing_key'])).toBe(true);

    expect(evaluateMetadataConditions(mockMetadata, ['status|date_issued'])).toBe(true);

    expect(evaluateMetadataConditions(mockMetadata, ['status_date|missing_key'])).toBe(false);
  });
});
