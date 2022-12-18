import { generateFileContents } from './generate';
import { createOptions } from './options';
import { clean, read, write } from './files';
import { parse } from './schema';
import { Options } from '.';

const generateFiles = async (options: Options): Promise<void> => {
  const allOptions = createOptions(options);
  // TODO source files exist if required
  await clean(allOptions);
  const fileContents = await read(allOptions);
  const parsedSchemas = parse(fileContents);
  const generatedFileContents = generateFileContents(parsedSchemas, allOptions);
  // TODO check no extant files or can overwrite
  await write(generatedFileContents, allOptions);
};

export { generateFiles };
