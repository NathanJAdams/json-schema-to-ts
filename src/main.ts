import { convertMany } from './convert';
import { generateContent } from './generate';
import { read } from './read';
import { PartialDeep } from './type-fest';
import { write } from './write';
import { createOptions, Options } from './Options';
import { parse } from './Schema';

const main = (optionsPartial: PartialDeep<Options>): Promise<void> => {
  const options: Options = createOptions(optionsPartial);
  return Promise.resolve()
    // TODO check source files exist
    // TODO check destination is clean or pre clean
    .then(() => read(options))
    .then((fileContents) => parse(fileContents))
    .then((fileSchemas) => convertMany(fileSchemas, options))
    // TODO check consistency
    .then((fileSchemas) => generateContent(fileSchemas, options))
    .then((filesContent) => write(filesContent, options));
};

const invoke = (): void => {
  const options: PartialDeep<Options> = {
    files: {
      source: {
        recursive: true
      }
    },
    ts: {
      enums: {
      }
    }
  };
  main(options);
};

export {
  main
};

invoke();
