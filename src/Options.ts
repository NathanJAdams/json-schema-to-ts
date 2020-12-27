import { UntypedType } from './ts';
import { PartialDeep } from './type-fest';

enum OptionalFieldPattern {
  QUESTION = 'fieldName?',
  PIPE_UNDEFINED = 'Type | undefined'
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
    enums: {
      use: boolean;
      fixedPrefix: string;
      badNameCharReplacement: string;
      booleanNullUpperCaseNames: boolean;
      booleanNullStringValues: boolean;
    };
    optionalFields: OptionalFieldPattern;
    untyped: UntypedType;
  };
}

const DEFAULT_OPTIONS: Options = {
  files: {
    source: {
      dir: 'src/schemas',
      encoding: 'utf-8',
      failOnEmpty: true,
      recursive: true
    },
    destination: {
      dir: 'src/generated',
      failOnExisting: true,
      preClean: false
    }
  },
  ts: {
    enums: {
      use: true,
      fixedPrefix: '_',
      badNameCharReplacement: '_',
      booleanNullUpperCaseNames: true,
      booleanNullStringValues: false
    },
    optionalFields: OptionalFieldPattern.QUESTION,
    untyped: UntypedType.UNKNOWN
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
      enums: {
        ...DEFAULT_OPTIONS.ts.enums,
        ...options?.ts?.enums
      }
    }
  };
};

export {
  OptionalFieldPattern,
  Options,
  DEFAULT_OPTIONS,
  createOptions
};
