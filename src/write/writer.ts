import * as fs from 'fs';
import * as path from 'path';
import { Options } from '../Options';

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

const write = (filesContent: Map<string, string>, options: Options): Promise<void> => {
  const promises: Promise<void>[] = [];
  return new Promise<void>((resolve, reject) => {
    filesContent.forEach((content: string, relativeFile: string) => {
      const absoluteFile: string = path.resolve(options.files.cwd || process.cwd(), options.files.destination.dir, relativeFile) + '.ts';
      const promise: Promise<void> = writeContent(content, absoluteFile);
      promises.push(promise);
    });
    Promise.all(promises)
      .then(() => resolve())
      .catch(reject);
  });
};

export {
  write
};
