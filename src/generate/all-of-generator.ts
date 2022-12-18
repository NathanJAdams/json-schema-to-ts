import { Schema } from '../schema';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { filtered } from '../util';

const allOfGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema = locatedSchema.schema;
  if (!schema.allOf || schema.allOf.length === 0) {
    return undefined;
  }
  const lines: (string | undefined)[] = [];
  schema.allOf.forEach((elementSchema: Schema) => {
    const elementLocatedSchema: LocatedSchema = {
      fileLocation: locatedSchema.fileLocation,
      schema: elementSchema
    };
    const elementContent = typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
    lines.push(elementContent);
  });
  const filteredLines: string[] = filtered(lines);
  if (filteredLines.length === 0) {
    return undefined;
  }
  return filteredLines.join('\n& ');
};

export {
  allOfGenerator
};
