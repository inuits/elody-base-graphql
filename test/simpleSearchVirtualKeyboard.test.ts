/**
 * The simple search keyboard is configured per client by layout NAME, but the PWA
 * needs the full simple-keyboard layout definitions, so the app-config endpoint
 * resolves the names before shipping them.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  allKeyboardLayouts,
  resolveKeyboardLayouts,
} from '../sources/virtualKeyboardLayouts';
import { getConfig } from '../endpoints/appConfigEndpoint';
import { Environment } from '../types/environmentTypes';

const environmentWith = (simpleSearch: any): Environment =>
  ({
    graphqlEndpoint: '/api/graphql',
    damsFrontend: 'http://localhost',
    api: {},
    oauth: {},
    customization: {},
    features: simpleSearch ? { simpleSearch } : {},
  }) as unknown as Environment;

afterEach(() => vi.restoreAllMocks());

describe('resolveKeyboardLayouts', () => {
  it('resolves configured names to their layout definitions', () => {
    expect(resolveKeyboardLayouts(['Arabic', 'Cyrillic'])).toEqual({
      Arabic: allKeyboardLayouts.Arabic,
      Cyrillic: allKeyboardLayouts.Cyrillic,
    });
  });

  it('is undefined when nothing is configured', () => {
    expect(resolveKeyboardLayouts(undefined)).toBeUndefined();
    expect(resolveKeyboardLayouts([])).toBeUndefined();
  });

  it('skips unknown names and reports them', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(resolveKeyboardLayouts(['Arabic', 'Klingon'])).toEqual({
      Arabic: allKeyboardLayouts.Arabic,
    });
    expect(error).toHaveBeenCalledOnce();
  });

  it('is undefined when none of the names is known', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(resolveKeyboardLayouts(['Klingon'])).toBeUndefined();
  });
});

describe('app-config simple search', () => {
  it('exposes the resolved layouts on features.simpleSearch', () => {
    const config: any = getConfig(
      environmentWith({
        itemTypes: [],
        simpleSearchMetadataKey: ['title'],
        virtualKeyboardLayouts: ['Hebrew'],
      })
    );

    expect(config.features.simpleSearch.virtualKeyboardLayouts).toEqual({
      Hebrew: allKeyboardLayouts.Hebrew,
    });
  });

  it('leaves the layouts out when the client did not configure any', () => {
    const config: any = getConfig(
      environmentWith({ itemTypes: [], simpleSearchMetadataKey: ['title'] })
    );

    expect(
      config.features.simpleSearch.virtualKeyboardLayouts
    ).toBeUndefined();
  });
});
