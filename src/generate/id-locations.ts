import { FileLocation } from '../files';
import { RootSchema } from '../schema';

const idLocations = (fileSchemas: Map<FileLocation, RootSchema>): Map<string, FileLocation> => {
  let idLocations: Map<string, FileLocation> = new Map();
  fileSchemas.forEach((rootSchema: RootSchema, fileLocation: FileLocation) => {
    const id: string | undefined = rootSchema.$id;
    if (id) {
      idLocations = idLocations.set(id, fileLocation);
    }
  });
  return idLocations;
};

export {
  idLocations
};
