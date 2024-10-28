import { OptionalFieldPattern } from '../options';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator, located } from './TypeGenerator';
import { typeGenerator } from './type-generator';

export const objectGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema = locatedSchema.schema;
  if (!schema.type || !schema.type.has('object') || !(schema.object)) {
    return;
  }
  const { properties, required, additionalProperties } = schema.object;
  const lines: string[] = [];
  lines.push('{');
  if (properties) {
    Array.from(properties.entries()).forEach(([propertyName, propertySchema]) => {
      const propertyLocatedSchema = located(propertySchema, locatedSchema);
      const type = typeGenerator(propertyLocatedSchema, gatheredInfo, inputInfo);
      if (type) {
        const isRequired = (required && required.has(propertyName));
        const isQuestion = (!isRequired && inputInfo.options.ts.optionalFields == OptionalFieldPattern.QUESTION);
        const isPipeUndefined = (!isRequired && inputInfo.options.ts.optionalFields == OptionalFieldPattern.PIPE_UNDEFINED);
        const lineParts: string[] = [];
        lineParts.push(propertyName);
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
  if (!additionalProperties) {
    lines.push('}');
  } else {
    const lastLineParts: string[] = [];
    lastLineParts.push('} & Record<string, ');
    const valueLocatedSchema = located(additionalProperties, locatedSchema);
    const valueType = typeGenerator(valueLocatedSchema, gatheredInfo, inputInfo) || inputInfo.options.ts.untyped;
    lastLineParts.push(valueType);
    lastLineParts.push('>');
    lines.push(lastLineParts.join(''));
  }
  return lines.join('\n');
};
