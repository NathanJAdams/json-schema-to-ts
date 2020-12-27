import { Options } from '../../Options';
import { TS, TupleTS } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';
import { combineElements, generateDefinitions, generateImports, generator } from './generate';

const tupleGenerator: TSGenerator<TupleTS> = {
  root: (ts: TupleTS, options: Options, location: SchemaLocation): string => {
    const references: Set<string> = new Set();
    const definition: string = tupleGenerator.definition(ts, options, location.file, references);
    const imports: string = generateImports(references);
    const definitions: string = generateDefinitions(ts, options, references);
    return combineElements(imports, definition, definitions);
  },
  definition: (ts: TupleTS, options: Options, definitionId: string, references: Set<string>): string => {
    const inlined: string = tupleGenerator.inline(ts, options, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: TupleTS, options: Options, references: Set<string>): string => {
    const elementTypesContent: string[] = [];
    ts.elementTypes.forEach((elementTS: TS) => {
      const content: string = generator(elementTS.tsType).inline(elementTS, options, references);
      elementTypesContent.push(content);
    });
    const joined: string = elementTypesContent.join(', ');
    return `[${joined}]`;
  }
};

export {
  tupleGenerator
};
