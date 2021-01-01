import { FileLocation } from '../files';
import { Options } from '../options';
import { Schema } from '../schema';
import { References } from './References';
import { TypeGenerator } from './TypeGenerator';

const referenceGenerator: TypeGenerator = (schema: Schema, _namedSchemas: Map<string, Schema>, references: References, _options: Options, idFileLocations: Map<string, FileLocation>): string | undefined => {
  const ref: string | undefined = schema.$ref;
  if (!ref) {
    return undefined;
  }
  const localRef: string | undefined = createLocalRef(ref);
  if (localRef) {
    return localRef;
  }
  const fullRef: string | undefined = createFullRef(ref, references, idFileLocations);
  if (fullRef) {
    return fullRef;
  }
  const relativeRef: string | undefined = createRelativeRef(schema.$id, ref, references, idFileLocations);
  if (relativeRef) {
    return relativeRef;
  }
  return undefined;
};

const createLocalRef = (ref: string): string | undefined => {
  const refNameMatch: RegExpMatchArray | null = ref.match(/^#?(?:\/definitions)?\/(.*)$/);
  if (!refNameMatch) {
    return undefined;
  }
  return refNameMatch[1];
};

const createFullRef = (ref: string, references: References, idFileLocations: Map<string, FileLocation>): string | undefined => {
  // root
  const fileLocation: FileLocation | undefined = idFileLocations.get(ref);
  if (fileLocation) {
    addExternalReference(references, fileLocation);
    return fileLocation.fileName;
  }
  // inner
  for (const [id, idFileLocation] of Array.from(idFileLocations)) {
    if (ref.startsWith(id)) {
      const rest: string = ref.substring(id.length);
      const innerRef: string | undefined = createLocalRef(rest);
      if (innerRef) {
        addExternalReference(references, idFileLocation, innerRef);
      }
      return innerRef;
    }
  }
  return undefined;
};

const createRelativeRef = (id: string | undefined, ref: string, references: References, idFileLocations: Map<string, FileLocation>): string | undefined => {
  if (!id) {
    return undefined;
  }
  const fileLocation: FileLocation | undefined = idFileLocations.get(id);
  if (!fileLocation) {
    return undefined;
  }
  for (const idFileLocation of Array.from(idFileLocations.values())) {
    if (fileLocation.dir === idFileLocation.dir) {
      if (ref.startsWith(idFileLocation.fileName)) {
        const rest: string = ref.substring(idFileLocation.fileName.length);
        // root
        if (rest === '' || rest === '#') {
          addExternalReference(references, idFileLocation);
          return idFileLocation.fileName;
        }
        // inner
        const innerRef: string | undefined = createLocalRef(rest);
        if (innerRef) {
          addExternalReference(references, idFileLocation, innerRef);
          return innerRef;
        }
      }
    }
  }
  return undefined;
};

const addExternalReference = (references: References, fileLocation: FileLocation, importName?: string): void => {
  let importNames: Set<string> | undefined = references.schema.get(fileLocation);
  if (!importNames) {
    importNames = new Set();
    references.schema.set(fileLocation, importNames);
  }
  importNames.add(importName || fileLocation.fileName);
};

export {
  referenceGenerator
};
