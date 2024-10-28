import { FileLocation } from '../files';
import {
  isAbsolute,
  isRelative,
  isLocal,
  isAbsoluteSchemaId,
  AbsoluteSchemaRef,
  AbsoluteFragmentSchemaRef,
  RelativeSchemaRef,
  RelativeFragmentSchemaRef,
  SchemaId,
} from '../ids';
import { References } from './References';
import {
  LocatedSchema,
  SchemaGatheredInfo,
  SchemaInputInfo,
  TypeGenerator,
} from './TypeGenerator';

export const referenceGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema = locatedSchema.schema;
  const id = schema.$id;
  const ref = schema.$ref;
  if (!ref) {
    return;
  }
  if (isLocal(ref)) {
    return ref.fragment;
  }
  const references = gatheredInfo.references;
  const idFileLocations = inputInfo.idFileLocations;
  if (isAbsolute(ref)) {
    return createFromAbsoluteRef(references, idFileLocations, ref);
  }
  if (isRelative(ref)) {
    if (id && isAbsoluteSchemaId(id)) {
      const absoluteRef = { authority: id.authority, ...ref };
      return createFromAbsoluteRef(references, idFileLocations, absoluteRef);
    } else {
      return createFromRelativeRef(references, idFileLocations, ref);
    }
  }
  return;
};

const createFromAbsoluteRef = (references: References, idFileLocations: Map<SchemaId, FileLocation>, ref: AbsoluteSchemaRef | AbsoluteFragmentSchemaRef): string | undefined => {
  const fileLocation = idFileLocations.get(ref);
  if (fileLocation) {
    return addExternalReference(
      references,
      fileLocation,
      (ref as AbsoluteFragmentSchemaRef).fragment
    );
  }
  return createFromRelativeRef(references, idFileLocations, ref);
};

const createFromRelativeRef = (references: References, idFileLocations: Map<SchemaId, FileLocation>, ref: | AbsoluteSchemaRef | AbsoluteFragmentSchemaRef | RelativeSchemaRef | RelativeFragmentSchemaRef): string | undefined => {
  const foundFileLocations = Array.from(idFileLocations.entries())
    .filter(
      ([schemaId, _]) =>
        !isAbsoluteSchemaId(schemaId) ||
        !isAbsolute(ref) ||
        schemaId.authority === ref.authority
    )
    .filter(([schemaId, _]) => schemaId.folder === ref.folder)
    .filter(([schemaId, _]) => schemaId.name === ref.name)
    .map(([_, fileLocation]) => fileLocation);
  return foundFileLocations && foundFileLocations.length === 1
    ? addExternalReference(
      references,
      foundFileLocations[0],
      (ref as RelativeFragmentSchemaRef).fragment
    )
    : undefined;
};

const addExternalReference = (references: References, fileLocation: FileLocation, importName?: string): string => {
  let importNames = references.schema.get(fileLocation);
  if (!importNames) {
    importNames = new Set();
    references.schema.set(fileLocation, importNames);
  }
  const name = importName || fileLocation.fileName;
  importNames.add(name);
  return name;
};
