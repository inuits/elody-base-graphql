import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { loadTranslationsFromDirectory } from '../translations/loadTranslations';

describe('loadTranslationsFromDirectory', () => {
  let directory: string;
  let warnSpy: ReturnType<typeof vi.spyOn>;

  const writeTranslationFile = (fileName: string, contents: object) =>
    fs.writeFileSync(
      path.join(directory, fileName),
      JSON.stringify(contents),
      'utf-8'
    );

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'translations-'));
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true });
    warnSpy.mockRestore();
  });

  it('loads a locale from the file whose name matches its wrapper key', () => {
    writeTranslationFile('nl.json', { nl: { greeting: 'Hallo' } });

    expect(loadTranslationsFromDirectory(directory)).toEqual({
      nl: { greeting: 'Hallo' },
    });
  });

  it('ignores files that are not json', () => {
    writeTranslationFile('nl.json', { nl: { greeting: 'Hallo' } });
    fs.writeFileSync(path.join(directory, 'readme.md'), '# not a locale');

    expect(Object.keys(loadTranslationsFromDirectory(directory))).toEqual([
      'nl',
    ]);
  });

  it('warns and skips a locale whose wrapper key does not match its filename', () => {
    writeTranslationFile('nl.json', { 'nl-BE': { greeting: 'Hallo' } });

    const translations = loadTranslationsFromDirectory(directory);

    expect(translations).not.toHaveProperty('nl');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('nl.json'),
    );
    expect(warnSpy.mock.calls[0][0]).toContain('nl-BE');
  });

  it('keeps loading the other locales when one is misconfigured', () => {
    writeTranslationFile('nl.json', { NL: { greeting: 'Hallo' } });
    writeTranslationFile('en.json', { en: { greeting: 'Hello' } });

    expect(loadTranslationsFromDirectory(directory)).toEqual({
      en: { greeting: 'Hello' },
    });
  });
});
