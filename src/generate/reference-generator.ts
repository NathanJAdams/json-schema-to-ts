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
  const localRef: string | undefined = definitionRef(ref);
  if (localRef) {
    return localRef;
  }
  const fileLocation: FileLocation | undefined = idFileLocations.get(ref);
  if (fileLocation) {
    addExternalReference(references, fileLocation);
    return fileLocation.fileName;
  }
  for (const [id, idFileLocation] of Array.from(idFileLocations)) {
    if (ref.startsWith(id)) {
      const rest: string = ref.substring(id.length);
      const externalRef: string | undefined = definitionRef(rest);
      if (externalRef) {
        addExternalReference(references, idFileLocation, externalRef);
      }
      return externalRef;
    }
  }
  return undefined;
};

const definitionRef = (ref: string): string | undefined => {
  const refNameMatch: RegExpMatchArray | null = ref.match(/^#?(?:\/definitions)?\/(.*)$/);
  if (!refNameMatch) {
    return undefined;
  }
  return refNameMatch[1];
};

const addExternalReference = (references: References, fileLocation: FileLocation, importName?: string): void => {
  let importNames: Set<string> | undefined = references.schema.get(fileLocation);
  if (!importNames) {
    importNames = new Set();
    references.schema.set(fileLocation, importNames);
  }
  importNames.add((importName || fileLocation.fileName));
};

export {
  referenceGenerator
};
