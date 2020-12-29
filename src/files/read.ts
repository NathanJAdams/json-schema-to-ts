import * as fs from 'fs';
import * as path from 'path';
import { Options } from '../options';
import { files, filesRecursive } from './walk';

const read = (options: Options): Promise<Map<string, string>> => {
  return new Promise((resolve, reject) => {
    const sourceDir = options.files.source.dir;
    const absoluteDir: string = (path.isAbsolute(sourceDir))
      ? sourceDir
      : path.resolve(options.files.cwd || process.cwd(), sourceDir);
    const filesPromise: Promise<string[]> = (options.files.source.recursive)
      ? filesRecursive(absoluteDir)
      : files(absoluteDir);
    const filesContent: Map<string, string> = new Map();
    const addContentPromise: (file: string) => Promise<void> = (file: string) => readContent(file, options)
      .then((content: string) => { filesContent.set(toRelativeFile(absoluteDir, file), content); })
      .catch(reject);
    filesPromise
      .then((files: string[]) => files.map(addContentPromise))
      .then((promises: Promise<void>[]) => Promise.all(promises))
      .then(() => resolve(filesContent))
      .catch(reject);
  });
};

const readContent = (file: string, options: Options): Promise<string> => {
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

const toRelativeFile = (absoluteDir: string, file: string): string => {
  const relativeFileName: string = path.relative(absoluteDir, file);
  return relativeFileName.substring(0, relativeFileName.indexOf('.'));
};

export {
  read
};
