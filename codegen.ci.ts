import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    './baseModule/*.schema.ts',
    './*.schema.ts',
    './node_modules/**/*.schema.ts',
  ],
  generates: {
    '../../generated-types/type-defs.ts:': {
      plugins: [{ typescript: {} }],
      config: {
        constEnums: true, // The magic bullet!
      },
    },
  },
};

export default config;
