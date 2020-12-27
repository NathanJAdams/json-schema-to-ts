import { TS, TupleTS } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';
import { combineNewline, generateDefinitions, generateImports, generator } from './generate';

const tupleGenerator: TSGenerator<TupleTS> = {
  root: (ts: TupleTS, location: SchemaLocation): string => {
    const references: Set<string> = new Set();
    const definition: string = tupleGenerator.definition(ts, location.file, references);
    const imports: string = generateImports(references);
    const definitions: string = generateDefinitions(ts, references);
    return combineNewline(imports, definition, definitions);
  },
  definition: (ts: TupleTS, definitionId: string, references: Set<string>): string => {
    const inlined: string = tupleGenerator.inline(ts, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: TupleTS, references: Set<string>): string => {
    const elementTypesContent: string[] = [];
    ts.elementTypes.forEach((elementTS: TS) => {
      const content: string = generator(elementTS.tsType).inline(elementTS, references);
      elementTypesContent.push(content);
    });
    const joined: string = elementTypesContent.join(', ');
    return `[${joined}]`;
  }
};

export {
  tupleGenerator
};
