import { FileLocation } from '../files';
import { SchemaId } from '../ids';
import { Schema } from '../schema';

const idLocations = (fileSchemas: Map<FileLocation, Schema>): Map<SchemaId, FileLocation> => {
  let idLocations: Map<SchemaId, FileLocation> = new Map();
  fileSchemas.forEach((schema, fileLocation) => {
    const id = schema.$id;
    if (id) {
      idLocations = idLocations.set(id, fileLocation);
    }
  });
  return idLocations;
};

export {
  idLocations
};
