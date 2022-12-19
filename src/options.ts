import { PartialDeep } from './types';

export enum UntypedType {
  ANY = 'any',
  NEVER = 'never',
  UNDEFINED = 'undefined',
  UNKNOWN = 'unknown'
}

export enum OptionalFieldPattern {
  QUESTION = 'fieldName?',
  PIPE_UNDEFINED = 'Type | undefined'
}

export type AllOptions = {
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

export type Options = PartialDeep<AllOptions>;

export const DEFAULT_OPTIONS: AllOptions = {
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

export const createOptions = (options: PartialDeep<AllOptions>): AllOptions => {
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
