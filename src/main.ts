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
    .then((res) => { console.log(res); return res; })
    .then((fileContents) => parse(fileContents))
    .then((res) => { console.log(res); return res; })
    .then((fileSchemas) => convertMany(fileSchemas))
    .then((res) => { console.log(res); return res; })
    // TODO check consistency
    .then((fileSchemas) => generateContent(fileSchemas, options))
    .then((res) => { console.log(res); return res; })
    .then((filesContent) => write(filesContent, options));
};

const invoke = (): void => {
  const options: PartialDeep<Options> = {
    files: {
      source: {
        recursive: true
      }
    }
  };
  main(options);
};

export {
  main
};

invoke();
