import { createModule } from 'graphql-modules';
import { baseSchema } from './baseSchema.schema';
import { mediafileSchema, mediafileResolver } from 'mediafile-module';
import { baseResolver } from './baseResolver';

const baseModule = createModule({
  id: 'baseModule',
  dirname: __dirname,
  typeDefs: [baseSchema, mediafileSchema],
  resolvers: [baseResolver, mediafileResolver],
});

export { baseModule, baseSchema, baseResolver };
