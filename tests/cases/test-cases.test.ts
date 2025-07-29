import * as fs from 'fs/promises';
import {
  AllOptions,
  OptionalFieldPattern,
  UntypedType,
} from '../../src/options';
import { generateFileContents } from '../../src/generate';
import { FileLocation, read } from '../../src/files';
import { parse } from '../../src/schema';

const createOptionsForReading = (dir: string, sourceDir: string): AllOptions => ({
  files: {
    cwd: `${__dirname}/${dir}`,
    source: {
      dir: `${__dirname}/${dir}/${sourceDir}`,
      encoding: 'ascii',
      recursive: true,
    },
    destination: {
      dir: '.',
      indexFiles: false,
      preClean: false,
    },
  },
  ts: {
    optionalFields: OptionalFieldPattern.QUESTION,
    untyped: UntypedType.UNKNOWN,
  },
});

const toFileNameContents = (fileLocationContents: Map<FileLocation, string>, keepExtension: boolean): Map<string, string> => {
  const fileNameContents: Map<string, string> = new Map();
  for (const [fileLocation, contents] of Array.from(fileLocationContents)) {
    const fileName = keepExtension
      ? fileLocation.fileNameWithExt
      : `${fileLocation.fileName}.ts`;
    fileNameContents.set(fileName, contents);
  }
  return fileNameContents;
};

const normaliseContents = (contents?: string): string | undefined =>
  contents
    ? contents.replace(/[\s]+/g, ' ').replace(/"/g, '\'')
    : undefined;

test('generated files match expected schemas', async () => {
  const dirents = await fs.readdir(__dirname, {
    withFileTypes: true,
  });
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const schemasOptions = createOptionsForReading(dirent.name, 'schemas');
      const schemasFileLocationContents = await read(schemasOptions);
      const parsedFileLocationContents = parse(schemasFileLocationContents);
      const generatedFileLocationContents = generateFileContents(
        parsedFileLocationContents,
        schemasOptions
      );
      const generated = toFileNameContents(
        generatedFileLocationContents,
        false
      );

      const expectedOptions = createOptionsForReading(
        dirent.name,
        'expected'
      );
      const expectedFileLocationContents = await read(expectedOptions);
      const expected = toFileNameContents(expectedFileLocationContents, true);

      expect(expected.size).toBe(generated.size);
      for (const [fileName, expectedContents] of Array.from(expected)) {
        const generatedContents = generated.get(fileName);
        expect(generatedContents).toBeDefined();
        expect(normaliseContents(generatedContents)).toBe(
          normaliseContents(expectedContents)
        );
      }
    }
  }
});
