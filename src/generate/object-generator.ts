import { Schema } from '../schema';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { OptionalFieldPattern, Options } from '../options';

const objectGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!schema.type || schema.type !== 'object' || !schema.properties) {
    return undefined;
  }
  const lines: string[] = [];
  lines.push('{');
  schema.properties.forEach((propertySchema: Schema, name: string) => {
    const type: string = typeGenerator(propertySchema, namedSchemas, references, options);
    const isRequired: boolean = ((schema.required !== undefined) && schema.required.has(name));
    const isQuestion: boolean = (!isRequired && options.ts.optionalFields == OptionalFieldPattern.QUESTION);
    const isPipeUndefined: boolean = (!isRequired && options.ts.optionalFields == OptionalFieldPattern.PIPE_UNDEFINED);
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
  });
  lines.push('}');
  return lines.join('\n');
};

export {
  objectGenerator
};
