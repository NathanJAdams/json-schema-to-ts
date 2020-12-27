import * as fs from 'fs';
import * as path from 'path';

const READ_OPTIONS: { withFileTypes: true; } = { withFileTypes: true };
const flatten = (previous: string[], current: string[]) => previous.concat(current);

const filesRecursive = (dir: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, READ_OPTIONS, (err: NodeJS.ErrnoException | null, files: fs.Dirent[]): void => {
      if (err) {
        reject(err);
      } else if (!files || files.length === 0) {
        resolve([]);
      } else {
        const resolveSubPath = (file: fs.Dirent) => path.resolve(dir, file.name);
        const subFiles: string[] = files.filter((file: fs.Dirent) => file.isFile()).map(resolveSubPath);
        const subDirs: string[] = files.filter((file: fs.Dirent) => file.isDirectory()).map(resolveSubPath);
        if (subDirs.length === 0) {
          resolve(subFiles);
        } else {
          Promise.all(subDirs.map(filesRecursive))
            .then((subDirFiles: string[][]) => subDirFiles.reduce(flatten, []))
            .then((allSubDirFiles: string[]) => subFiles.concat(allSubDirFiles))
            .then(resolve)
            .catch(reject);
        }
      }
    });
  });
};

const files = (dir: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, READ_OPTIONS, (err: NodeJS.ErrnoException | null, files: fs.Dirent[]): void => {
      if (err) {
        reject(err);
      } else if (!files || files.length === 0) {
        resolve([]);
      } else {
        const resolveSubPath = (file: fs.Dirent) => path.resolve(dir, file.name);
        const subFiles: string[] = files.filter((file: fs.Dirent) => file.isFile()).map(resolveSubPath);
        resolve(subFiles);
      }
    });
  });
};

export {
  files,
  filesRecursive
};
