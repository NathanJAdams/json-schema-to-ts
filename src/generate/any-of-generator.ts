import { Schema } from '../schema';
import { filtered } from '../util';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const anyOfGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.anyOf || schema.anyOf.length === 0) {
    return undefined;
  }
  const lines: (string | undefined)[] = [];
  schema.anyOf.forEach((elementSchema: Schema) => {
    const elementLocatedSchema: LocatedSchema = {
      fileLocation: locatedSchema.fileLocation,
      schema: elementSchema
    };
    const elementContent: string | undefined = typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
    lines.push(elementContent);
  });
  const filteredLines: string[] = filtered(lines);
  if (filteredLines.length === 0) {
    return undefined;
  } else if (filteredLines.length === 1) {
    return filteredLines[0];
  } else {
    return '(' + filteredLines.join('\n| ') + ')';
  }
};

export {
  anyOfGenerator
};
