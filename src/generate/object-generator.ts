import { OptionalFieldPattern } from '../options';
import { Schema } from '../schema';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const objectGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.type || schema.type !== 'object' || !(schema.properties || schema.additionalProperties)) {
    return undefined;
  }
  const lines: string[] = [];
  lines.push('{');
  if (schema.properties) {
    schema.properties.forEach((propertySchema: Schema, name: string) => {
      const propertyLocatedSchema: LocatedSchema = {
        fileLocation: locatedSchema.fileLocation,
        schema: propertySchema
      };
      const type: string | undefined = typeGenerator(propertyLocatedSchema, gatheredInfo, inputInfo);
      if (type) {
        const isRequired: boolean = ((schema.required !== undefined) && schema.required.has(name));
        const isQuestion: boolean = (!isRequired && inputInfo.options.ts.optionalFields == OptionalFieldPattern.QUESTION);
        const isPipeUndefined: boolean = (!isRequired && inputInfo.options.ts.optionalFields == OptionalFieldPattern.PIPE_UNDEFINED);
        const lineParts: string[] = [];
        lineParts.push(name);
        if (isQuestion) {
          lineParts.push('?');
        }
        lineParts.push(`: ${type}`);
        if (isPipeUndefined) {
          lineParts.push(' | undefined');
        }
        lineParts.push(';');
        lines.push(lineParts.join(''));
      }
    });
  }
  if (schema.additionalProperties === false) {
    lines.push('}');
  } else {
    const lastLineParts: string[] = [];
    lastLineParts.push('} & Record<string, ');
    const valueType: string | undefined = (schema.additionalProperties)
      ? typeGenerator({ fileLocation: locatedSchema.fileLocation, schema: schema.additionalProperties }, gatheredInfo, inputInfo)
      : undefined;
    if (!valueType) {
      lastLineParts.push(inputInfo.options.ts.untyped);
    } else {
      lastLineParts.push(valueType);
    }
    lastLineParts.push('>');
    lines.push(lastLineParts.join(''));
  }
  return lines.join('\n');
};

export {
  objectGenerator
};
