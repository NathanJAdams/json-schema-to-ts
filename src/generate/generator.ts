import * as path from 'path';
import { TS, TSType } from '../ts';
import { Options } from '../Options';
import { SchemaLocation } from '..';
import { collectionGenerator, primitiveGenerator, tupleGenerator } from './generators';

interface TSGenerator<T extends TS> {
  root: (ts: T, options: Options, location: SchemaLocation) => string;
  definition: (ts: T, options: Options, definitionId: string, references: Set<string>) => string;
  inline: (ts: T, options: Options, references: Set<string>) => string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const generator = (tsType: TSType): TSGenerator<any> => {
  switch (tsType) {
  case TSType.COLLECTION:
    return collectionGenerator;
    // case TSType.COMBINATION:
    //   return undefined;
    // case TSType.OBJECT:
    //   return undefined;
  case TSType.PRIMITIVE:
    return primitiveGenerator;
    // case TSType.REFERENCE:
    //   return undefined;
  case TSType.TUPLE:
    return tupleGenerator;
  default:
    throw Error(`Cannot generate content for type: ${tsType}`);
  }
};

const generateRoot = (ts: TS, options: Options, location: SchemaLocation): string => {
  return generator(ts.tsType).root(ts, options, location);
};

const generateContent = (filesTS: Map<string, TS>, options: Options): Map<string, string> => {
  const fileContent: Map<string, string> = new Map();
  filesTS.forEach((ts: TS, relativeFile: string) => {
    const lastSepIndex = relativeFile.lastIndexOf(path.sep);
    const relativeDir: string = relativeFile.substring(0, lastSepIndex);
    const file: string = relativeFile.substring(lastSepIndex + 1);
    const location: SchemaLocation = {
      relativeDir,
      file
    };
    const generated: string = generateRoot(ts, options, location);
    fileContent.set(relativeFile, generated);
  });
  return fileContent;
};

export {
  TSGenerator,
  generator,
  generateRoot,
  generateContent
};
