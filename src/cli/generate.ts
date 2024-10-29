#!/usr/bin/env node

import { Command } from 'commander';
import { OptionalFieldPattern, Options, UntypedType } from '../options';
import { generateFiles } from '../generateFiles';

// These are valid values for the type BufferEncoding
const validEncodings = ['ascii', 'utf8', 'utf-8', 'utf16le', 'ucs2', 'ucs-2', 'base64', 'base64url', 'latin1', 'binary', 'hex'];
const validPatternNames = Object.keys(OptionalFieldPattern);
const validTypeNames = Object.keys(UntypedType);

const validateEncoding = (encoding: string): string => {
  if (validEncodings.includes(encoding)) {
    return encoding;
  }
  throw Error(`Invalid source file encoding: '${encoding}'. Valid options are: ${arrayToString(validEncodings)}`);
};

const validatePattern = (patternName: string): string => {
  if (validPatternNames.includes(patternName)) {
    return patternName;
  }
  throw Error(`Invalid optional field pattern: '${patternName}'. Valid options are: ${arrayToString(validPatternNames)}`);
};

const validateType = (typeName: string): string => {
  if (validTypeNames.includes(typeName)) {
    return typeName;
  }
  throw Error(`Invalid untyped type: '${typeName}'. Valid options are: ${arrayToString(validTypeNames)}`);
};

const arrayToString = (array: string[]) => `['${array.join('\', \'')}']`;

const program = new Command();

program
  .option('-c, --cwd <DIRECTORY>', 'Working directory', process.cwd())
  .option('-s, --source <DIRECTORY>', 'Source directory of schema files, relative to working directory', 'src/schemas')
  .option('-d, --destination <DIRECTORY>', 'Destination directory of generated .ts files, relative to working directory', 'src/generated')
  .option('-e, --encoding <ENCODING>', `Encoding of source files, one of: ${arrayToString(validEncodings)}`, validateEncoding, 'utf-8')
  .option('-r, --recursive', 'Recurse into source directory and generate from nested files', true)
  .option('-R, --no-recursive', 'Only generate from schema files directly in source directory, do not recurse deeper')
  .option('-p, --pre-clean', 'Delete destination directory before generating files', false)
  .option('-P, --no-pre-clean', 'Overwrite destination directory when generating files')
  .option('-i, --index-files', 'Add index files', true)
  .option('-I, --no-index-files', 'Do not add index files')
  .option('-o, --optional-field-pattern <PATTERN>', `The pattern to use for optional fields, one of: ${arrayToString(validPatternNames)}`, validatePattern, 'QUESTION')
  .option('-u, --untyped-type <TYPE>', `The untyped field type, one of: ${arrayToString(validTypeNames)}`, validateType, 'UNKNOWN')
  .action(async (opts) => {
    const options: Options = {
      files: {
        cwd: opts.cwd,
        destination: {
          dir: opts.destination,
          indexFiles: opts.indexFiles,
          preClean: opts.preClean
        },
        source: {
          dir: opts.source,
          encoding: opts.encoding,
          recursive: opts.recursive
        }
      },
      ts: {
        optionalFields: OptionalFieldPattern[opts.optionalFieldPattern as keyof typeof OptionalFieldPattern],
        untyped: UntypedType[opts.untypedType as keyof typeof UntypedType],
      }
    };
    await generateFiles(options);
  });

program.parse(process.argv);
