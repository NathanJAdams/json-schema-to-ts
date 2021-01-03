import * as fs from 'fs';
import * as path from 'path';
import { AllOptions } from '../options';
import { FileLocation } from './FileLocation';

const write = (filesContent: Map<FileLocation, string>, options: AllOptions): Promise<void> => {
  const promises: Promise<void>[] = [];
  return new Promise<void>((resolve, reject) => {
    const cwd: string = options.files.cwd || process.cwd();
    const rootSourceDir: string = path.resolve(cwd, options.files.source.dir);
    const rootDestinationDir: string = path.resolve(cwd, options.files.destination.dir);
    const folderFiles: Map<string, Set<string>> = new Map();
    filesContent.forEach((content: string, fileLocation: FileLocation) => {
      const relativeDir: string = path.relative(rootSourceDir, fileLocation.dir);
      const absoluteDir: string = path.resolve(rootDestinationDir, relativeDir);
      const absoluteFile: string = path.resolve(absoluteDir, fileLocation.fileName) + '.ts';
      const promise: Promise<void> = writeContent(content, absoluteFile);
      let files: Set<string> | undefined = folderFiles.get(absoluteDir);
      if (!files) {
        files = new Set();
        folderFiles.set(absoluteDir, files);
      }
      files.add(fileLocation.fileName);
      promises.push(promise);
    });
    if (options.files.destination.indexFiles) {
      promises.push(createIndexFiles(folderFiles));
    }
    Promise.all(promises)
      .then(() => resolve())
      .catch(reject);
  });
};

const createIndexFiles = (folderFiles: Map<string, Set<string>>): Promise<void> => {
  return new Promise((resolve, reject) => {
    const promises: Promise<void>[] = [];
    Array.from(folderFiles.entries()).forEach(([folder, files]) => {
      const indexFileName = `${folder}/index.ts`;
      const contentLines: string[] = [];
      Array.from(files).sort().forEach((file) => {
        const line = `export * from './${file}';`;
        contentLines.push(line);
      });
      const content: string = contentLines.join('\n');
      promises.push(writeContent(content, indexFileName));
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
