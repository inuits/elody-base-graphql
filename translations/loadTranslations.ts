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
    const fileContents = loadTranslations(path.join(directory, `${fileName}`));

    if (!(translationKey in fileContents)) {
      console.warn(
        `Skipping translation file ${fileName} in ${directory}: expected a top-level "${translationKey}" key, found ${
          Object.keys(fileContents).join(', ') || 'nothing'
        }. Wrap the translations in "${translationKey}" or rename the file.`
      );
      return;
    }

    baseTranslations[translationKey] = fileContents[translationKey];
  });
  return baseTranslations;
};

export const loadTranslations = (filePath: string): { [key: string]: any } => {
  const translations = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(translations);
};
