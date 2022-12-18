import { FileLocation } from '../files';
import { SchemaId } from '../ids';
import { AllOptions } from '../options';
import { Schema } from '../schema';
import { fileGenerator } from './file-generator';
import { idLocations } from './id-locations';
import { LocatedSchema, SchemaInputInfo } from './TypeGenerator';

const generateFileContents = (fileSchemas: Map<FileLocation, Schema>, options: AllOptions): Map<FileLocation, string> => {
  const idFileLocations: Map<SchemaId, FileLocation> = idLocations(fileSchemas);
  const inputInfo: SchemaInputInfo = {
    idFileLocations,
    options
  };
  const fileContents: Map<FileLocation, string> = new Map();
  fileSchemas.forEach((schema: Schema, fileLocation: FileLocation) => {
    const locatedSchema: LocatedSchema = {
      fileLocation,
      schema
    };
    const generated = fileGenerator(locatedSchema, inputInfo);
    fileContents.set(fileLocation, generated);
  });
  return fileContents;
};

export {
  generateFileContents
};
