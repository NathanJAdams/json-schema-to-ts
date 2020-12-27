import * as path from 'path';
import { TS, TSType } from '../ts';
import { SchemaLocation } from '..';
import {
  collectionGenerator,
  enumGenerator,
  primitiveGenerator,
  tupleGenerator,
  untypedGenerator
} from './generators';

interface TSGenerator<T extends TS> {
  root: (ts: T, location: SchemaLocation) => string;
  definition: (ts: T, definitionId: string, references: Set<string>) => string;
  inline: (ts: T, references: Set<string>) => string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const generator = (tsType: TSType): TSGenerator<any> => {
  switch (tsType) {
  case TSType.COLLECTION:
    return collectionGenerator;
    // case TSType.COMBINATION:
    //   return undefined;
  case TSType.ENUM:
    return enumGenerator;
    // case TSType.OBJECT:
    //   return undefined;
  case TSType.PRIMITIVE:
    return primitiveGenerator;
    // case TSType.REFERENCE:
    //   return undefined;
  case TSType.TUPLE:
    return tupleGenerator;
  case TSType.UNTYPED:
    return untypedGenerator;
  default:
    throw Error(`Cannot generate content for type: ${tsType}`);
  }
};

const generateRoot = (ts: TS, location: SchemaLocation): string => {
  return generator(ts.tsType).root(ts, location);
};

const generateContent = (filesTS: Map<string, TS>): Map<string, string> => {
  const fileContent: Map<string, string> = new Map();
  filesTS.forEach((ts: TS, relativeFile: string) => {
    const lastSepIndex = relativeFile.lastIndexOf(path.sep);
    const relativeDir: string = relativeFile.substring(0, lastSepIndex);
    const file: string = relativeFile.substring(lastSepIndex + 1);
    const location: SchemaLocation = {
      relativeDir,
      file
    };
    const generated: string = generateRoot(ts, location);
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
