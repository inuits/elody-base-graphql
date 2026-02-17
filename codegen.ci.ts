import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '/app/schemas/*.schema.ts',
  generates: {
    '../../generated-types/type-defs.ts:': {
      plugins: [{ typescript: {} }],
    },
  },
  config: {
    enumsAsTypes: false,
    preResolveTypes: true,
    scalars: { Void: 'void' },
    useTypeImports: false,
    dedupeFragments: true,
  },
};

export default config;
