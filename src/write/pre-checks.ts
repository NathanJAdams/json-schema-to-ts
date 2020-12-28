import fs from 'fs';
import { Options } from '../Options';
import { RootSchema } from '../schema';

const throwOnExtantPath = (path: string): void => {
  if (fs.existsSync(path)) {
    throw new Error(`Pre-Check: Output path: ${path} already exists`);
  }
};

const throwOnNoInput = (fileSchemas: Map<string, RootSchema>): void => {
  if (fileSchemas.size === 0) {
    throw Error('Pre-Check: No typescript types to output');
  }
};

const preChecker = (fileSchemas: Map<string, RootSchema>, options: Options): void => {
  if (options.files.source.failOnEmpty) {
    throwOnNoInput(fileSchemas);
  }
  if (!options.files.destination.overwrite) {
    fileSchemas.forEach((_schema: RootSchema, path: string) => {
      throwOnExtantPath(path);
    });
  }
};

export {
  preChecker
};
