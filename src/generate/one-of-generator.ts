import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { Schema } from '../schema';
import { filtered } from '../util';
import { ONE_OF, References } from './References';
import { TypeGenerator } from './TypeGenerator';
import { typeGenerator } from './type-generator';

const oneOfGenerator: TypeGenerator = (schema: Schema, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string | undefined => {
  if (!schema.oneOf || schema.oneOf.length === 0) {
    return undefined;
  }
  const lines: (string | undefined)[] = [];
  schema.oneOf.forEach((elementSchema: Schema) => {
    const elementContent: string | undefined = typeGenerator(elementSchema, namedSchemas, references, options, idFileLocations);
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
    references.package.get(ONE_OF)?.add(typeName);
    const combinedTypeNames: string = filteredLines.join(', ');
    return `${typeName}<${combinedTypeNames}>`;
  }
};

export {
  oneOfGenerator
};
