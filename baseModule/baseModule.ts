import { createModule } from 'graphql-modules';
import { baseSchema } from './baseSchema.schema';
import { baseResolver } from './baseResolver';

const baseModule = createModule({
  id: 'baseModule',
  dirname: __dirname,
  typeDefs: [baseSchema],
  resolvers: [baseResolver],
});

export { baseModule, baseSchema, baseResolver };
