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

interface Options {
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
    };
  };
  ts: {
    optionalFields: OptionalFieldPattern;
    untyped: UntypedType;
  };
}

const DEFAULT_OPTIONS: Options = {
  files: {
    source: {
      dir: 'src/schemas',
      encoding: 'utf-8',
      recursive: true
    },
    destination: {
      dir: 'src/generated',
      preClean: false
    }
  },
  ts: {
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
      ...options.ts
    }
  };
};

export {
  OptionalFieldPattern,
  Options,
  DEFAULT_OPTIONS,
  createOptions
};
