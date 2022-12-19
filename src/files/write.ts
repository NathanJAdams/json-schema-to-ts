import * as fs from 'fs/promises';
import * as path from 'path';
import { AllOptions } from '../options';
import { FileLocation } from './FileLocation';

export const write = async (filesContent: Map<FileLocation, string>, options: AllOptions): Promise<void> => {
  const promises: Promise<void>[] = [];
  const cwd = options.files.cwd || process.cwd();
  const rootSourceDir = path.resolve(cwd, options.files.source.dir);
  const rootDestinationDir = path.resolve(cwd, options.files.destination.dir);
  const folderFiles: Map<string, Set<string>> = new Map();
  filesContent.forEach((content: string, fileLocation: FileLocation) => {
    const relativeDir = path.relative(rootSourceDir, fileLocation.dir);
    const absoluteDir = path.resolve(rootDestinationDir, relativeDir);
    const absoluteFile = path.resolve(absoluteDir, fileLocation.fileName) + '.ts';
    const promise = writeContent(content, absoluteFile);
    let files = folderFiles.get(absoluteDir);
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
  await Promise.all(promises);
};

const createIndexFiles = async (folderFiles: Map<string, Set<string>>): Promise<void> => {
  const promises: Promise<void>[] = [];
  Array.from(folderFiles.entries()).forEach(([folder, files]) => {
    const indexFileName = `${folder}/index.ts`;
    const content = Array.from(files)
      .sort()
      .map((file) => `export * from './${file}';`)
      .join('\n');
    promises.push(writeContent(content, indexFileName));
  });
  await Promise.all(promises);
};

const writeContent = async (content: string, absoluteFile: string): Promise<void> => {
  await mkdirs(absoluteFile);
  await fs.writeFile(absoluteFile, content);
};

const mkdirs = async (absoluteFile: string): Promise<void> => {
  const parentDir = absoluteFile.substring(0, absoluteFile.lastIndexOf(path.sep));
  await fs.mkdir(parentDir, { recursive: true });
};
