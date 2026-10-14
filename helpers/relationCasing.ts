import { readdirSync, readFileSync } from 'fs';
import path from 'path';

const RELATION_TYPE_PATTERNS: RegExp[] = [
  /\b(?:fromRelationType|relationType|relationKey)\s*:\s*["'`]([^"'`]+)["'`]/g,
  /\bkey\s*:\s*"([^"]+)"\s*,\s*source\s*:\s*relations\b/g,
  /\bsource\s*:\s*relations\s*,\s*key\s*:\s*"([^"]+)"/g,
  /["'`][^"'`\s]*?\b(?:relations|relationValues)\.(\w+)/g,
  /\brelationType=(\w+)/g,
  /["'`]\$?((?:ref|has|is)[A-Z]\w*)["'`]/g,
];

export type CamelCaseRelation = { line: number; value: string };

export const findCamelCaseRelations = (
  source: string,
  allow: string[] = []
): CamelCaseRelation[] =>
  source.split('\n').flatMap((text, index) =>
    [
      ...new Set(
        RELATION_TYPE_PATTERNS.flatMap((pattern) =>
          [...text.matchAll(pattern)].map((match) => match[1])
        )
      ),
    ]
      .filter((value) => /[A-Z]/.test(value) && !allow.includes(value))
      .map((value) => ({ line: index + 1, value }))
  );

const listTypeScriptFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory())
      return entry.name === 'generated-types' || entry.name === 'node_modules'
        ? []
        : listTypeScriptFiles(entryPath);
    return entry.name.endsWith('.ts') ? [entryPath] : [];
  });

export const assertSnakeCaseRelations = (
  srcDir: string,
  { allow = [] }: { allow?: string[] } = {}
): void => {
  const violations = listTypeScriptFiles(srcDir).flatMap((file) =>
    findCamelCaseRelations(readFileSync(file, 'utf8'), allow).map(
      ({ line, value }) => `${path.relative(srcDir, file)}:${line}: ${value}`
    )
  );
  if (violations.length)
    throw new Error(
      `Relation types must be snake_case (add core relations to "allow"):\n${violations.join('\n')}`
    );
};
