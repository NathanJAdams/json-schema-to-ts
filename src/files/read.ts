import * as fs from 'fs/promises';
import * as path from 'path';
import { AllOptions } from '../options';
import { FileLocation } from './FileLocation';
import { files } from './walk';

const read = async (options: AllOptions): Promise<Map<FileLocation, string>> => {
  const sourceDir = options.files.source.dir;
  const encoding = options.files.source.encoding;
  const recursive = options.files.source.recursive;
  const cwd = options.files.cwd || process.cwd();
  const absoluteDir = path.isAbsolute(sourceDir)
    ? sourceDir
    : path.resolve(cwd, sourceDir);
  const filesContent: Map<FileLocation, string> = new Map();
  for await (const file of files(absoluteDir, recursive)) {
    const fileLocation = toFileLocation(file);
    const content = await fs.readFile(file, encoding);
    filesContent.set(fileLocation, content);
  }
  return filesContent;
};

const toFileLocation = (file: string): FileLocation => {
  const dir = path.dirname(file);
  const fileNameWithExt = path.basename(file);
  const fileName = fileNameWithExt.substring(0, fileNameWithExt.indexOf('.'));
  return {
    dir,
    fileName,
    fileNameWithExt,
  };
};

export {
  read
};
