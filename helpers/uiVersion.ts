// Which UI a deployment runs, so the PWA can put it on every usage event and
// trace: a beta track publishes this package with its name as the prerelease
// label (0.11.0-redesign.3 on beta/redesign), a release is the current UI.
export const uiVersionFromPackageVersion = (version: string): string =>
  version.replace(/\+.*$/, '').match(/^[^-]+-([^.]+)/)?.[1] || 'current';
