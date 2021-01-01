import * as fs from 'fs';
import * as path from 'path';
import { AllOptions } from '../options';
import { FileLocation } from './FileLocation';
import { files, filesRecursive } from './walk';

const read = (options: AllOptions): Promise<Map<FileLocation, string>> => {
  return new Promise((resolve, reject) => {
    const sourceDir = options.files.source.dir;
    const absoluteDir: string = (path.isAbsolute(sourceDir))
      ? sourceDir
      : path.resolve(options.files.cwd || process.cwd(), sourceDir);
    const filesPromise: Promise<string[]> = (options.files.source.recursive)
      ? filesRecursive(absoluteDir)
      : files(absoluteDir);
    const filesContent: Map<FileLocation, string> = new Map();
    const addContentPromise: (file: string) => Promise<void> = (file: string) => readContent(file, options)
      .then((content: string) => { filesContent.set(toFileLocation(file), content); })
      .catch(reject);
    filesPromise
      .then((files: string[]) => files.map(addContentPromise))
      .then((promises: Promise<void>[]) => Promise.all(promises))
      .then(() => resolve(filesContent))
      .catch(reject);
  });
};

const readContent = (file: string, options: AllOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, { encoding: options.files.source.encoding }, (err: NodeJS.ErrnoException | null, data: string): void => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const toFileLocation = (file: string): FileLocation => {
  const dir: string = path.dirname(file);
  const fileNameWithExt: string = path.basename(file);
  const fileName: string = fileNameWithExt.substring(0, fileNameWithExt.indexOf('.'));
  return {
    dir,
    fileName
  };
};

export {
  read
};
