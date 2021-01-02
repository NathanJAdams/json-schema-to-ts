import { FileLocation } from '../files';
import { Schema } from '../schema';
import { References } from './References';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator } from './TypeGenerator';

const referenceGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema: Schema = locatedSchema.schema;
  const ref: string | undefined = schema.$ref;
  if (!ref) {
    return undefined;
  }
  const localRef: string | undefined = createLocalRef(ref);
  if (localRef) {
    return localRef;
  }
  const fullRef: string | undefined = createFullRef(ref, gatheredInfo, inputInfo);
  if (fullRef) {
    return fullRef;
  }
  const relativeRef: string | undefined = createRelativeRef(locatedSchema.fileLocation, ref, gatheredInfo, inputInfo);
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

const createFullRef = (ref: string, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  // root
  const fileLocation: FileLocation | undefined = inputInfo.idFileLocations.get(ref);
  if (fileLocation) {
    addExternalReference(gatheredInfo.references, fileLocation);
    return fileLocation.fileName;
  }
  // inner
  for (const [id, idFileLocation] of Array.from(inputInfo.idFileLocations)) {
    if (ref.startsWith(id)) {
      const rest: string = ref.substring(id.length);
      const innerRef: string | undefined = createLocalRef(rest);
      if (innerRef) {
        addExternalReference(gatheredInfo.references, idFileLocation, innerRef);
      }
      return innerRef;
    }
  }
  return undefined;
};

const createRelativeRef = (fileLocation: FileLocation, ref: string, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  for (const idFileLocation of Array.from(inputInfo.idFileLocations.values())) {
    if (fileLocation.dir === idFileLocation.dir) {
      if (ref.startsWith(idFileLocation.fileName)) {
        const rest: string = ref.substring(idFileLocation.fileName.length);
        // root
        if (rest === '' || rest === '#') {
          addExternalReference(gatheredInfo.references, idFileLocation);
          return idFileLocation.fileName;
        }
        // inner
        const innerRef: string | undefined = createLocalRef(rest);
        if (innerRef) {
          addExternalReference(gatheredInfo.references, idFileLocation, innerRef);
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
