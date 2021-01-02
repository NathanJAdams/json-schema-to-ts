import { Schema } from '../schema';
import { filtered } from '../util';
import { ONE_OF } from './References';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const oneOfGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  if (!schema.oneOf || schema.oneOf.length === 0) {
    return undefined;
  }
  const lines: (string | undefined)[] = [];
  schema.oneOf.forEach((elementSchema: Schema) => {
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
  } else if (filteredLines.length > 8) {
    throw Error('Cannot currently create OneOf type for more than 8 types');
  } else {
    const typeName = `OneOf_${filteredLines.length}`;
    gatheredInfo.references.package.get(ONE_OF)?.add(typeName);
    const combinedTypeNames: string = filteredLines.join(', ');
    return `${typeName}<${combinedTypeNames}>`;
  }
};

export {
  oneOfGenerator
};
