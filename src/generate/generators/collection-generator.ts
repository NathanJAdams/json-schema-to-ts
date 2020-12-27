import { Options } from '../../Options';
import { CollectionTS, CollectionType } from '../../ts';
import { SchemaLocation } from '../..';
import { TSGenerator } from '..';
import { combineElements, generateDefinitions, generateImports, generator } from './generate';

const collectionGenerator: TSGenerator<CollectionTS> = {
  root: (ts: CollectionTS, options: Options, location: SchemaLocation): string => {
    const references: Set<string> = new Set();
    const definition: string = collectionGenerator.definition(ts, options, location.file, references);
    const imports: string = generateImports(references);
    const definitions: string = generateDefinitions(ts, options, references);
    return combineElements(imports, definition, definitions);
  },
  definition: (ts: CollectionTS, options: Options, definitionId: string, references: Set<string>): string => {
    const inlined: string = collectionGenerator.inline(ts, options, references);
    return `export type ${definitionId} = ${inlined};`;
  },
  inline: (ts: CollectionTS, options: Options, references: Set<string>): string => {
    const isArray: boolean = (ts.collectionType === CollectionType.ARRAY);
    const prefix = (isArray)
      ? ''
      : 'Set<';
    const suffix = (isArray)
      ? '[]'
      : '>';
    const inlinedElementType = generator(ts.elementType.tsType).inline(ts.elementType, options, references);
    return `${prefix}${inlinedElementType}${suffix}`;
  }
};

export {
  collectionGenerator
};
