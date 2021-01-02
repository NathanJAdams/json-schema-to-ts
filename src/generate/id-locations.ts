import { FileLocation } from '../files';
import { Schema } from '../schema';

const idLocations = (fileSchemas: Map<FileLocation, Schema>): Map<string, FileLocation> => {
  let idLocations: Map<string, FileLocation> = new Map();
  fileSchemas.forEach((schema: Schema, fileLocation: FileLocation) => {
    const id: string | undefined = schema.$id;
    if (id) {
      idLocations = idLocations.set(id, fileLocation);
    }
  });
  return idLocations;
};

export {
  idLocations
};
