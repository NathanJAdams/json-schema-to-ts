import * as fs from 'fs';
import * as path from 'path';
import { AllOptions } from '../options';
import { FileLocation } from './FileLocation';

const write = (filesContent: Map<FileLocation, string>, options: AllOptions): Promise<void> => {
  const promises: Promise<void>[] = [];
  return new Promise<void>((resolve, reject) => {
    const cwd: string = options.files.cwd || process.cwd();
    const rootDir: string = path.resolve(cwd, options.files.destination.dir);
    filesContent.forEach((content: string, fileLocation: FileLocation) => {
      const absoluteFile: string = path.resolve(rootDir, fileLocation.dir, fileLocation.fileName) + '.ts';
      const promise: Promise<void> = writeContent(content, absoluteFile);
      promises.push(promise);
    });
    Promise.all(promises)
      .then(() => resolve())
      .catch(reject);
  });
};

const writeContent = (content: string, absoluteFile: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    mkdirs(absoluteFile)
      .then(() => {
        fs.writeFile(absoluteFile, content, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
      .catch(reject);
  });
};

const mkdirs = (absoluteFile: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const dir: string = absoluteFile.substring(0, absoluteFile.lastIndexOf(path.sep));
    fs.mkdir(dir, { recursive: true }, (err: NodeJS.ErrnoException | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export {
  write
};
