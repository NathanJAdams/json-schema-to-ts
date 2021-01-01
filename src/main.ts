import { generate } from './generate';
import { createOptions, AllOptions } from './options';
import { clean, read, write } from './files';
import { parse } from './schema';
import { Options } from '.';

const main = (options: Options): Promise<void> => {
  const allOptions: AllOptions = createOptions(options);
  return Promise.resolve()
    // TODO source files exist if required
    .then(() => clean(allOptions))
    .then(() => read(allOptions))
    .then((fileContents) => parse(fileContents))
    .then((fileSchemas) => generate(fileSchemas, allOptions))
    // TODO check no extant files or can overwrite
    .then((filesContent) => write(filesContent, allOptions))
    .catch(console.error);
};

export {
  main
};
