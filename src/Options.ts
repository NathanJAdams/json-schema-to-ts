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
    useEnums: boolean;
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
    optionalFields: OptionalFieldPattern.QUESTION,
    useEnums: false
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
      ...options?.ts
    }
  };
};

export {
  OptionalFieldPattern,
  Options,
  DEFAULT_OPTIONS,
  createOptions
};
