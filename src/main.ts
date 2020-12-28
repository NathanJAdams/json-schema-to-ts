import { generate } from './generate';
import { createOptions, Options } from './Options';
import { read } from './read';
import { parse } from './schema';
import { PartialDeep } from './types';
import { write } from './write';

const main = (optionsPartial: PartialDeep<Options>): Promise<void> => {
  const options: Options = createOptions(optionsPartial);
  return Promise.resolve()
    // TODO check source files exist if required
    // TODO check destination is clean or can clean or overwrite
    .then(() => read(options))
    .then((fileContents) => parse(fileContents))
    // TODO check consistency
    .then((fileSchemas) => generate(fileSchemas, options))
    // TODO clean output dir if required
    // TODO check no extant files or can overwrite
    .then((filesContent) => write(filesContent, options));
};

const invoke = (): void => {
  const options: PartialDeep<Options> = {};
  main(options);
};

export {
  main
};

invoke();
