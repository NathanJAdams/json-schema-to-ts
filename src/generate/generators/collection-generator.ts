import { CollectionTS, CollectionType } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';
import { combineNewline, generateDefinitions, generateImports, generator } from './generate';

const collectionGenerator: TSGenerator<CollectionTS> = {
  root: (ts: CollectionTS, location: SchemaLocation): string => {
    const references: Set<string> = new Set();
    const definition: string = collectionGenerator.definition(ts, location.file, references);
    const imports: string = generateImports(references);
    const definitions: string = generateDefinitions(ts, references);
    return combineNewline(imports, definition, definitions);
  },
  definition: (ts: CollectionTS, definitionId: string, references: Set<string>): string => {
    const inlined: string = collectionGenerator.inline(ts, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: CollectionTS, references: Set<string>): string => {
    const isArray: boolean = (ts.collectionType === CollectionType.ARRAY);
    const prefix = (isArray)
      ? ''
      : 'Set<';
    const suffix = (isArray)
      ? '[]'
      : '>';
    const inlinedElementType = generator(ts.elementType.tsType).inline(ts.elementType, references);
    return `${prefix}${inlinedElementType}${suffix}`;
  }
};

export {
  collectionGenerator
};
