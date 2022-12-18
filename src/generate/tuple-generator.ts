import { Schema } from '../schema';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const tupleGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema = locatedSchema.schema;
  if (!schema.type || !schema.type.has('array') || !schema.items || !Array.isArray(schema.items)) {
    return undefined;
  }
  const elementTypesContent: string[] = [];
  schema.items.forEach((elementSchema: Schema) => {
    const elementLocatedSchema: LocatedSchema = {
      fileLocation: locatedSchema.fileLocation,
      schema: elementSchema
    };
    const content = typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
    if (content) {
      elementTypesContent.push(content);
    }
  });
  if (schema.additionalItems !== false) {
    const lastTypeParts: string[] = [];
    lastTypeParts.push('...');
    const valueType = (schema.additionalItems)
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
  const joined = elementTypesContent.join(', ');
  return `[${joined}]`;
};

export {
  tupleGenerator
};
