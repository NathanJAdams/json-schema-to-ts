# json-schema-typescript-generator
A utility to generate typescript files from json schema files

## Contents
[Install](#Install)

[Usage](#Usage)

[Typescript](#Typescript)

[Approach](#Approach)

[Issues](#Issues)


## Install
Install via one of the commands

    npm -i json-schema-typescript-generator -D
    yarn add json-schema-typescript-generator -D


## Usage
To generate .ts files, import the `main` function and `Options` interface like this

    import { main, Options } from 'json-schema-typescript-generator';

Then create an Options object and invoke the main function with it like this

    const options: Options = {...}
    main(options);

The [Options.ts](src/Options.ts) object is defined as follows:

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


## Typescript

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


## Approach

The approach this utility takes is to only do one thing but do it well. It doesn't do any validation, consistency checking, linting, prettifying etc. It assumes the schema author knows exactly what they want and will generate typescript files that represent the schemas given as closely as possible, even if the generated types don't make sense or cannot be satisfied.

An example will make this clear:

Given the following schema in a file called `A.json`

    {
      "type": "number",
      "$ref": "#/definitions/BOOL",
      "enum": [
        null,
        "tuv",
        "xyz"
      ],
      "oneOf": [
        {
          "type": "string"
        },
        {
          "$ref": "#/definitions/BOOL"
        }
      ],
      "definitions": {
        "BOOL": {
          "type": "boolean"
        }
      }
    }

Invoking the generator will generate a file `A.ts` containing:

    import { OneOf_2 } from 'json-schema-typescript-generator';

    export type A = number
    & BOOL
    & (null | 'tuv' | 'xyz')
    & OneOf_2<string, BOOL>;

    export type BOOL = boolean;


Clearly type `A` cannot ever be satisfied, but it does match what the schema specified


## Issues

### OneOf
The utility currently only supports up to and including 8 schemas inside a `oneOf` array. This should be plenty for most use cases, however this will be an issue for some users. Support for an arbitrary number is on the [TODO](TODO.md) list and will be coming soon.
