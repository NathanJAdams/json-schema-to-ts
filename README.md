# json-schema-typescript-generator
A utility to generate typescript files from json schema files

## Contents
[Install](#Install)

[Usage](#Usage)

[Typescript](#Typescript)

[JSONSchema](#JSONSchema)

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

The [Options](src/options.ts) object is defined as follows:

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

The option

    files/destination/preClean

defines whether the destination folder will be deleted before generating typescript files.<br><br>

Note that the folders given by the options

    files/source/dir
    files/destination/dir

will be resolved relative to the folder given by the option

    files/cwd


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


## JSONSchema
Support for properties defined in the JSON Schema are as follows:

| Key | Support | Notes
|---------|-----|------
| $id     | ✔
| $schema | ✘ | Action in TODO to support specific schema versions
| $ref | ✔ | local definition<br>absolute reference to root/inner definition<br>relative reference to root/inner definition
| enum | ✔ | null<br>booleans<br>numbers<br>strings
| type | ✔ | null<br>boolean<br>integer<br>number<br>string<br>array<br>object
| number properties | ✘ | multipleOf<br>minimum<br>maximum<br>exclusiveMinimum<br>exclusiveMaximum<br><br>No typescript support for `multipleOf`<br>[Open question on GitHub about number ranges](https://github.com/Microsoft/TypeScript/issues/15480)
| string properties | ✘ | minLength<br>maxLength<br>pattern<br>format<br><br>[Potential support for string length](https://stackoverflow.com/questions/51813272/declaring-string-type-with-min-max-length-in-typescript)<br>[Typescript support for string patterns and formats in v4.1](https://stackoverflow.com/questions/51445767/how-to-define-a-regex-matched-string-type-in-typescript)
| array properties | ✔ | items<br>uniqueItems<br>additionalItems<br><br>`T[]` - Array if `items` is a schema and `uniqueItems=false`<br>`Set<T>` - Set if `items` is a schema and `uniqueItems=true`<br>`[T, U, V]` - Tuple if `items` is an array
| array properties | ✘ | contains<br>minItems<br>maxItems<br><br>array (and possibly tuple) min length: `type MinLengthArray<T> = [T, T, ...T[]];` Although no typescript support for a `Set<T>` of specific size<br>No typescript support for contains
| object properties | ✔ | properties<br>additionalProperties
| combinations | ✔ | allOf<br>anyOf<br>oneOf<br><br>oneOf is supported for 90% of use cases with a workaround for unsupported cases. An action is in the [TODO](TODO.md) to support an arbitrary number of schemas in a oneOf array

## Approach

The approach this utility takes is to only do one thing but do it well, ie. transforming schema files to typescript files. It doesn't download any schemas, or do any validation, consistency checking, linting, prettifying etc. It assumes the schema author knows exactly what they want and it will generate typescript files that represent the schemas given as closely as possible, even if the generated types don't make sense or cannot be satisfied.

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
This utility currently only supports up to and including 8 schemas inside a `oneOf` array. This should be plenty for most use cases, however this may be an issue for some users. Support for an arbitrary number is on the [TODO](TODO.md) list and will be coming soon.
In the meantime, a workaround is to split up the `oneOf` array into smaller `oneOf` arrays defined in a `definitions` section and compose them into a master `oneOf` array.

An example follows where a `oneOf` array of 9 elements is needed which the generator will fail to generate:

    {
      "oneOf": [
        {
          "$ref": "#/definitions/A1"
        },
        {
          "$ref": "#/definitions/A2"
        },
        {
          "$ref": "#/definitions/A3"
        },
        {
          "$ref": "#/definitions/B1"
        },
        {
          "$ref": "#/definitions/B2"
        },
        {
          "$ref": "#/definitions/B3"
        },
        {
          "$ref": "#/definitions/C1"
        },
        {
          "$ref": "#/definitions/C2"
        },
        {
          "$ref": "#/definitions/C3"
        }
      ],
      "definitions": {...}
    }

The schema could be split up and composed as follows, allowing the generator to generate the typescript files as normal:

    {
      "oneOf": [
        {
          "$ref": "#/definitions/Part_A"
        },
        {
          "$ref": "#/definitions/Part_B"
        },
        {
          "$ref": "#/definitions/Part_C"
        }
      ],
      "definitions": {
        "Part_A": {
          "oneOf": [
            {
              "$ref": "#/definitions/A1"
            },
            {
              "$ref": "#/definitions/A2"
            },
            {
              "$ref": "#/definitions/A3"
            }
          ]
        },
        "Part_B": {
          "oneOf": [same as Part_A but for B1, B2, B3]
        },
        "Part_C":  {
          "oneOf": [same as Part_A but for C1, C2, C3]
        },
        ...other definitions as before
      }
    }