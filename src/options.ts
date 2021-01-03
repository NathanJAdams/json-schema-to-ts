import { PartialDeep } from './types';

enum UntypedType {
  ANY = 'any',
  NEVER = 'never',
  UNDEFINED = 'undefined',
  UNKNOWN = 'unknown'
}

enum OptionalFieldPattern {
  QUESTION = 'fieldName?',
  PIPE_UNDEFINED = 'Type | undefined'
}

interface AllOptions {
  files: {
    cwd?: string;
    source: {
      dir: string;
      encoding: BufferEncoding;
      recursive: boolean;
    };
    destination: {
      dir: string;
      preClean: boolean;
      indexFiles: boolean;
    };
  };
  ts: {
    optionalFields: OptionalFieldPattern;
    untyped: UntypedType;
  };
}

type Options = PartialDeep<AllOptions>;

const DEFAULT_OPTIONS: AllOptions = {
  files: {
    source: {
      dir: 'src/schemas',
      encoding: 'utf-8',
      recursive: true
    },
    destination: {
      dir: 'src/generated',
      preClean: false,
      indexFiles: true
    }
  },
  ts: {
    optionalFields: OptionalFieldPattern.QUESTION,
    untyped: UntypedType.UNKNOWN
  }
};

const createOptions = (options: PartialDeep<AllOptions>): AllOptions => {
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
      ...options.ts
    }
  };
};

export {
  OptionalFieldPattern,
  AllOptions,
  Options,
  DEFAULT_OPTIONS,
  createOptions
};
