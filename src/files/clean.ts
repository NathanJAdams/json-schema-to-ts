import * as path from 'path';
import { rimraf } from 'rimraf';
import { AllOptions } from '../options';

export const clean = async (options: AllOptions): Promise<void> => {
  if (!options.files.destination.preClean) {
    return;
  }
  const cwd = options.files.cwd || process.cwd();
  const absoluteDir = path.resolve(cwd, options.files.destination.dir);
  await rimraf(absoluteDir);
};
