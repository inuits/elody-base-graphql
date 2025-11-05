import fs from 'fs';
import path from 'path';

export const loadTranslationsFromDirectory = (
  directory: string
): { [key: string]: object } => {
  const baseTranslations: { [key: string]: object } = {};
  const translationFileNames: string[] = fs
    .readdirSync(directory)
    .filter((fileName: string) => fileName.endsWith('.json'));

  translationFileNames.forEach((fileName: string) => {
    const translationKey = fileName.replace('.json', '');
    baseTranslations[translationKey] = loadTranslations(
      path.join(directory, `${fileName}`)
    )[translationKey];
  });
  return baseTranslations;
};

export const loadTranslations = (filePath: string): { [key: string]: any } => {
  const translations = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(translations);
};
