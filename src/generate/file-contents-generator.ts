import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { Schema } from '../schema';
import { fileGenerator } from './file-generator';
import { idLocations } from './id-locations';
import { LocatedSchema, SchemaInputInfo } from './TypeGenerator';

const generateFileContents = (fileSchemas: Map<FileLocation, Schema>, options: AllOptions): Map<FileLocation, string> => {
  const idFileLocations: Map<string, FileLocation> = idLocations(fileSchemas);
  const fileContent: Map<FileLocation, string> = new Map();
  const inputInfo: SchemaInputInfo = {
    idFileLocations,
    options
  };
  fileSchemas.forEach((schema: Schema, fileLocation: FileLocation) => {
    const locatedSchema: LocatedSchema = {
      fileLocation,
      schema
    };
    const generated: string = fileGenerator(locatedSchema, inputInfo);
    fileContent.set(fileLocation, generated);
  });
  return fileContent;
};

export {
  generateFileContents
};
