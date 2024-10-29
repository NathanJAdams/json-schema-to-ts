import { Schema } from '../schema';
import { filtered } from '../util';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator, located } from './TypeGenerator';
import { typeGenerator } from './type-generator';

export const oneOfGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema = locatedSchema.schema;
  if (!schema.oneOf || schema.oneOf.length === 0) {
    return;
  }
  const lines: (string | undefined)[] = [];
  schema.oneOf.forEach((elementSchema: Schema) => {
    const elementLocatedSchema = located(elementSchema, locatedSchema);
    const elementContent = typeGenerator(elementLocatedSchema, gatheredInfo, inputInfo);
    lines.push(elementContent);
  });
  const filteredLines: string[] = filtered(lines);
  if (filteredLines.length === 0) {
    return;
  } else if (filteredLines.length === 1) {
    return filteredLines[0];
  } else {
    gatheredInfo.oneOfTypes.add(filteredLines.length);
    const typeName = `OneOf_${filteredLines.length}`;
    const combinedTypeNames = filteredLines.join(', ');
    return `${typeName}<${combinedTypeNames}>`;
  }
};
