import fs from 'fs';
import { Options } from '../Options';
import { TS } from '../ts';

const throwOnExtantPath = (path: string): void => {
  if (fs.existsSync(path)) {
    throw new Error(`Pre-Check: Output path: ${path} already exists`);
  }
};

const throwOnNoInput = (typeFiles: Map<TS, string>): void => {
  if (!typeFiles || typeFiles.size === 0) {
    throw Error('Pre-Check: No typescript types to output');
  }
};

const preChecker = (typeFiles: Map<TS, string>, options: Options): void => {
  if (options.files.source.failOnEmpty) {
    throwOnNoInput(typeFiles);
  }
  if (options.files.destination.failOnExisting) {
    typeFiles.forEach((path: string) => {
      throwOnExtantPath(path);
    });
  }
};

export {
  preChecker
};
