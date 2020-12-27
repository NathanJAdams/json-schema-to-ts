import { PartialDeep } from './type-fest';

enum OptionalFieldPattern {
  QUESTION = 'fieldName?',
  PIPE_UNDEFINED = 'Type | undefined'
}

interface EnumOptions {
  fixedPrefix: string;
  badNameCharReplacement: string;
  booleanNullUpperCaseNames: boolean;
  booleanNullStringValues: boolean;
}

interface Options {
  files: {
    cwd?: string;
    source: {
      dir: string;
      encoding: BufferEncoding;
      failOnEmpty: boolean;
      recursive: boolean;
    };
    destination: {
      dir: string;
      preClean: boolean;
      failOnExisting: boolean;
    };
  };
  ts: {
    enums: false | EnumOptions;
    optionalFields: OptionalFieldPattern;
  };
}

const DEFAULT_OPTIONS: Options = {
  files: {
    source: {
      dir: 'src/schemas',
      encoding: 'utf-8',
      failOnEmpty: true,
      recursive: false
    },
    destination: {
      dir: 'src/generated',
      failOnExisting: true,
      preClean: false
    }
  },
  ts: {
    enums: {
      fixedPrefix: '_',
      badNameCharReplacement: '_',
      booleanNullUpperCaseNames: true,
      booleanNullStringValues: false
    },
    optionalFields: OptionalFieldPattern.QUESTION
  }
};

const createOptions = (options: PartialDeep<Options>): Options => {
  return {
    files: {
      ...DEFAULT_OPTIONS.files,
      ...options.files,
      source: {
        ...DEFAULT_OPTIONS.files.source,
        ...options.files?.source
      },
      destination: {
        ...DEFAULT_OPTIONS.files.destination,
        ...options.files?.destination
      }
    },
    ts: {
      ...DEFAULT_OPTIONS.ts,
      ...options?.ts,
      enums: (options.ts?.enums)
        ? {
          ...DEFAULT_OPTIONS.ts.enums as EnumOptions,
          ...options.ts.enums
        }
        : false
    }
  };
};

export {
  EnumOptions,
  OptionalFieldPattern,
  Options,
  DEFAULT_OPTIONS,
  createOptions
};
