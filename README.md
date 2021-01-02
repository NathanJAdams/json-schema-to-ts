# json-schema-typescript-generator
A utility to generate typescript files from json schema files

## Install
Install via one of the commands

    npm -i json-schema-typescript-generator -D
    yarn add json-schema-typescript-generator -D

## Usage
To generate .ts files, first import the `main` function like this

    import { main } from 'json-schema-typescript-generator';

The behavior of the utility is defined by an [Options.ts](src/Options.ts) object

    {
      files: {
        cwd: string;
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

All options are optional and fall back to their defaults if not given, which are as follows:

    files: {
      cwd: process.cwd(),
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

Note that the folders given by the options

    files/source/dir
    files/destination/dir

will be resolved relative to the folder given by the option

    files/cwd

The option

    files/destination/preClean

defines whether the destination folder will be deleted before generating typescript files


## Typescript options

There are 2 options which define the style of code generated

### `OptionalFieldPattern`

This option defines how optional fields are represented

    ts/optionalFields

and can take 1 of 2 values:

    QUESTION

    type Example = {
      a?: string;
    };

or

    PIPE_UNDEFINED

    type Example = {
      a: string | undefined;
    }

### `UntypedType`

This option defines the fallback type used for types that failed to be generated, eg. perhaps the schema was empty, or an id was missing or a typo was made in a $ref entry etc. It is represented by

    ts/untyped

and takes 1 of 4 values:

    ANY

    type Example = {
      a: any
    }

or

    NEVER

    type Example = {
      a: never
    }

or

    UNDEFINED

    type Example = {
      a: undefined
    }

or

    UNKNOWN

    type Example = {
      a: unknown
    }
