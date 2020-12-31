import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { RootSchema } from '../schema';
import { fileGenerator } from './file-generator';
import { idLocations } from './id-locations';

const generate = (fileSchemas: Map<FileLocation, RootSchema>, options: AllOptions): Map<FileLocation, string> => {
  const idFileLocations: Map<string, FileLocation> = idLocations(fileSchemas);
  const fileContent: Map<FileLocation, string> = new Map();
  fileSchemas.forEach((rootSchema: RootSchema, fileLocation: FileLocation) => {
    const generated: string = fileGenerator(fileLocation, rootSchema, options, idFileLocations);
    fileContent.set(fileLocation, generated);
  });
  return fileContent;
};

export {
  generate
};
