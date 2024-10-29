import { Schema } from '../schema';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator, located } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { filtered } from '../util';

export const allOfGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema = locatedSchema.schema;
  if (!schema.allOf || schema.allOf.length === 0) {
    return;
  }
  const lines: (string | undefined)[] = [];
  schema.allOf.forEach((elementSchema: Schema) => {
    const elementLocatedSchema = located(elementSchema, locatedSchema);
    const elementContent = typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
    lines.push(elementContent);
  });
  const filteredLines: string[] = filtered(lines);
  if (filteredLines.length === 0) {
    return;
  }
  return filteredLines.join('\n& ');
};
