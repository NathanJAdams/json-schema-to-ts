import { generate } from './generate';
import { createOptions, Options } from './options';
import { clean, read, write } from './files';
import { parse } from './schema';
import { PartialDeep } from './types';

const main = (optionsPartial: PartialDeep<Options>): Promise<void> => {
  const options: Options = createOptions(optionsPartial);
  return Promise.resolve()
    // TODO source files exist if required
    .then(() => clean(options))
    .then(() => read(options))
    .then((fileContents) => parse(fileContents))
    .then((fileSchemas) => generate(fileSchemas, options))
    // // TODO check no extant files or can overwrite
    .then((filesContent) => write(filesContent, options))
    .catch(console.error);
};

export {
  main
};
