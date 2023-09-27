import fs from 'fs';
import path from 'path';

export const loadTranslations = (filePath: string): Object => {
  const translations = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(translations);
};
