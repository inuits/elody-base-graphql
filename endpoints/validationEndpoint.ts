import { Express, Request, Response } from 'express';
import { AnyObject, ObjectSchema, date, object, string } from 'yup';

const baseValidationSchema = object().shape({
  id: string().required(),
  name: string().required(),
  title: string().required(),
  description: string().notRequired(),
  email: string().email(),
  date: date().default(() => new Date()),
});

const mergeValidationSchemas = (
  baseSchema: ObjectSchema<AnyObject>,
  schemas: ObjectSchema<AnyObject>[] | undefined
): ObjectSchema<AnyObject> => {
  if (!schemas) return baseValidationSchema;
  const mergedFields: any = baseSchema.fields;
  schemas.forEach((schema: ObjectSchema<AnyObject>) =>
    Object.assign(mergedFields, schema.fields)
  );
  baseSchema.fields = mergedFields;
  return baseSchema;
};

export const applyValidationEndpoint = (
  app: Express,
  customValidationSchemas: Object[] | undefined
) => {
  const validationSchema = mergeValidationSchemas(
    baseValidationSchema,
    customValidationSchemas as ObjectSchema<AnyObject>[]
  ).describe();
  app.get('/api/validation', async (request: Request, response: Response) => {
    if (!validationSchema)
      response.status(404).end('No validation schema found');
    response.status(200).json(validationSchema);
  });
};
