/**
 * Which UI a deployment runs, so usage events and traces can be split by it.
 * A beta track publishes this package with its name as the prerelease label
 * (0.11.0-redesign.3 on beta/redesign); a release is the current UI.
 */
import { describe, it, expect } from 'vitest';
import { uiVersionFromPackageVersion } from '../helpers/uiVersion';
import { getConfig } from '../endpoints/appConfigEndpoint';
import { Environment } from '../types/environmentTypes';

describe('uiVersionFromPackageVersion', () => {
  it('is current for a release', () => {
    expect(uiVersionFromPackageVersion('0.10.52')).toBe('current');
  });

  it("is the beta track's name for a prerelease", () => {
    expect(uiVersionFromPackageVersion('0.11.0-redesign.3')).toBe('redesign');
    expect(uiVersionFromPackageVersion('0.11.0-redesign')).toBe('redesign');
  });

  it('keeps a hyphen in the track name', () => {
    expect(uiVersionFromPackageVersion('0.12.0-per-field.1')).toBe('per-field');
  });

  it('ignores build metadata', () => {
    expect(uiVersionFromPackageVersion('0.10.52+434856')).toBe('current');
    expect(uiVersionFromPackageVersion('0.11.0-redesign.3+434856')).toBe(
      'redesign'
    );
  });
});

describe('getConfig uiVersion', () => {
  it('ships the ui version to the PWA', () => {
    const environment = {
      graphqlEndpoint: '/api/graphql',
      damsFrontend: 'http://localhost',
      api: {},
      oauth: {},
      customization: {},
      features: {},
      uiVersion: 'redesign',
    } as unknown as Environment;
    expect(getConfig(environment).uiVersion).toBe('redesign');
  });
});
