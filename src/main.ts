import { generate } from './generate';
import { createOptions, Options } from './Options';
import { read } from './read';
import { parse } from './schema';
import { PartialDeep } from './types';
import { write } from './write';

const main = (optionsPartial: PartialDeep<Options>): Promise<void> => {
  const options: Options = createOptions(optionsPartial);
  return Promise.resolve()
    // TODO check source files exist
    // TODO check destination is clean or pre clean
    .then(() => read(options))
    .then((fileContents) => parse(fileContents))
    // TODO check consistency
    .then((fileSchemas) => generate(fileSchemas, options))
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
