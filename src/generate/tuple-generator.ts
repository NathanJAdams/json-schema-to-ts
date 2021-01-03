import { Schema } from '../schema';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const tupleGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.type || schema.type !== 'array' || !schema.items || !Array.isArray(schema.items)) {
    return undefined;
  }
  const elementTypesContent: string[] = [];
  schema.items.forEach((elementSchema: Schema) => {
    const elementLocatedSchema: LocatedSchema = {
      fileLocation: locatedSchema.fileLocation,
      schema: elementSchema
    };
    const content: string | undefined = typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
    if (content) {
      elementTypesContent.push(content);
    }
  });
  if (schema.additionalItems !== false) {
    const lastTypeParts: string[] = [];
    lastTypeParts.push('...');
    const valueType: string | undefined = (schema.additionalItems)
      ? typeGenerator({ fileLocation: locatedSchema.fileLocation, schema: schema.additionalItems }, gatheredInfo, inputInfo)
      : undefined;
    if (valueType) {
      lastTypeParts.push(valueType);
    } else {
      lastTypeParts.push(inputInfo.options.ts.untyped);
    }
    lastTypeParts.push('[]');
    elementTypesContent.push(lastTypeParts.join(''));
  }
  const joined: string = elementTypesContent.join(', ');
  return `[${joined}]`;
};

export {
  tupleGenerator
};
