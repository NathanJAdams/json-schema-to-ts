import * as path from 'path';
import { Options } from '../Options';
import { RootSchema, SchemaLocation } from '../schema';
import { fileGenerator } from './file-generator';

const generate = (fileContents: Map<string, RootSchema>, options: Options): Map<string, string> => {
  const fileContent: Map<string, string> = new Map();
  fileContents.forEach((rootSchema: RootSchema, relativeFile: string) => {
    const lastSepIndex = relativeFile.lastIndexOf(path.sep);
    const relativeDir: string = '.' + path.sep + relativeFile.substring(0, lastSepIndex);
    const file: string = relativeFile.substring(lastSepIndex + 1);
    const location: SchemaLocation = {
      relativeDir,
      file
    };
    const generated: string = fileGenerator(location, rootSchema, options);
    fileContent.set(relativeFile, generated);
  });
  return fileContent;
};

export {
  generate
};
