import * as path from 'path';
import rimraf from 'rimraf';
import { AllOptions } from '../options';

const clean = (options: AllOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!options.files.destination.preClean) {
      resolve();
    } else {
      const cwd: string = options.files.cwd || process.cwd();
      const absoluteDir: string = path.resolve(cwd, options.files.destination.dir);
      rmrf(absoluteDir)
        .then(resolve)
        .catch(reject);
    }
  });
};

const rmrf = (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const func = (err: Error | null): void => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    };
    rimraf(dir, func);
  });
};

export {
  clean
};
