import { filtered } from '../util';
import { allOfGenerator } from './all-of-generator';
import { anyOfGenerator } from './any-of-generator';
import { basicGenerator } from './basic-generator';
import { enumGenerator } from './enum-generator';
import { oneOfGenerator } from './one-of-generator';
import { referenceGenerator } from './reference-generator';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';

const typeGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const types: (string | undefined)[] = [];
  types.push(referenceGenerator(locatedSchema, gatheredInfo, inputInfo));
  types.push(enumGenerator(locatedSchema, gatheredInfo, inputInfo));
  types.push(basicGenerator(locatedSchema, gatheredInfo, inputInfo));
  types.push(allOfGenerator(locatedSchema, gatheredInfo, inputInfo));
  types.push(anyOfGenerator(locatedSchema, gatheredInfo, inputInfo));
  types.push(oneOfGenerator(locatedSchema, gatheredInfo, inputInfo));
  const filteredLines: string[] = filtered(types);
  if (filteredLines.length === 0) {
    return inputInfo.options.ts.untyped;
  }
  return filteredLines.join('\n& ');
};

export {
  typeGenerator
};
