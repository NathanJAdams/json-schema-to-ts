# json-schema-typescript-generator

Generate typescript files from json schema files

## Contents

[Install](#Install)

[Usage](#Usage)

[Typescript](#Typescript)

[JSONSchema](#JSONSchema)

[Approach](#Approach)

## Install

Install via one of the commands

```sh
npm -i json-schema-typescript-generator -D
yarn add json-schema-typescript-generator -D
```

## Usage

To generate .ts files from the command line, run the command `json-schema-typescript-generator`.

Usage: `json-schema-typescript-generator [options]`

| Option                                 | Description                                                                                                                                                   |
|:---------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| -c, --cwd <DIRECTORY>                  | Working directory (default: `process.cwd()`)                                                                                                                  |
| -s, --source <DIRECTORY>               | Source directory of schema files, relative to working directory (default: `src/schemas`)                                                                      |
| -d, --destination <DIRECTORY>          | Destination directory of generated .ts files, relative to working directory (default: `src/generated`)                                                        |
| -e, --encoding <ENCODING>              | Encoding of source files, one of: [`ascii`, `utf8`, `utf-8`, `utf16le`, `ucs2`, `ucs-2`, `base64`, `base64url`, `latin1`, `binary`, `hex`] (default: `utf-8`) |
| -r, --recursive                        | Recurse into source directory and generate from nested files (default: `true`)                                                                                  |
| -R, --no-recursive                     | Only generate from schema files directly in source directory, do not recurse deeper                                                                           |
| -p, --pre-clean                        | Delete destination directory before generating files (default: `false`)                                                                                         |
| -P, --no-pre-clean                     | Overwrite destination directory when generating files                                                                                                         |
| -i, --index-files                      | Add index files (default: `true`)                                                                                                                               |
| -I, --no-index-files                   | Do not add index files                                                                                                                                        |
| -o, --optional-field-pattern <PATTERN> | The pattern to use for optional fields, one of: [`QUESTION`, `PIPE_UNDEFINED`] (default: `QUESTION`)                                                          |
| -u, --untyped-type <TYPE>              | The untyped field type, one of: [`ANY`, `NEVER`, `UNDEFINED`, `UNKNOWN`] (default: `UNKNOWN`)                                                                 |
| -h, --help                             | Display help for command                                                                                                                                      |


It is also possible to run the command within code by importing from the library.
To generate .ts files, invoke the `generateFiles` function with an `Options` object like so

```ts
import { generateFiles, Options } from 'json-schema-typescript-generator';

const options: Options = {...}
await generateFiles(options);
```

The [Options](src/options.ts) object is defined as follows:

```ts
{
  files: {
    cwd: string;
    source: {
      dir: string;
      encoding: BufferEncoding;
      recursive: boolean;
    }
    destination: {
      dir: string;
      preClean: boolean;
      indexFiles: boolean;
    }
  }
  ts: {
    optionalFields: OptionalFieldPattern;
    untyped: UntypedType;
  }
}
```

All options are optional and fall back to their defaults if not given, which are as follows:

```ts
{
  files: {
    cwd: process.cwd(),
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
}
```

The option

```ts
options.files.destination.preClean;
```

defines whether the destination folder will be deleted before generating typescript files.<br><br>

The option

```ts
options.files.destination.indexFiles;
```

defines whether index.ts files will be generated in each destination folder.<br><br>

Note that the folders given by the options

```ts
options.files.source.dir;
options.files.destination.dir;
```

will be resolved relative to the folder given by the option

```ts
options.files.cwd;
```

## Typescript

There are 2 options which define the style of code generated

### `OptionalFieldPattern`

The option

```ts
options.ts.optionalFields;
```

defines how optional fields are represented and can take 1 of 2 values:

```ts
OptionalFieldPattern.QUESTION;

type Example = {
  a?: string;
};
```

or

```ts
OptionalFieldPattern.PIPE_UNDEFINED;

type Example = {
  a: string | undefined;
};
```

### `UntypedType`

The option

```ts
options.ts.untyped;
```

defines the fallback type used for types that failed to be generated, eg. perhaps the schema was empty, or an id was missing or a typo was made in a $ref entry etc. It can take 1 of 4 values:

```ts
UntypedType.ANY;

type Example = {
  a: any;
};
```

or

```ts
UntypedType.NEVER;

type Example = {
  a: never;
};
```

or

```ts
UntypedType.UNDEFINED;

type Example = {
  a: undefined;
};
```

or

```ts
UntypedType.UNKNOWN;

type Example = {
  a: unknown;
};
```

## JSONSchema

Support for properties defined in the JSON Schema are as follows:

| Key               | Support | Notes                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| $id               | ✔       |
| $schema           | ✘       | Action in TODO to support specific schema versions                                                                                                                                                                                                                                                                                             |
| $ref              | ✔       | local definition<br>absolute reference to root/inner definition<br>relative reference to root/inner definition                                                                                                                                                                                                                                 |
| $defs             | ✔       | Combined with `definitions`                                                                                                                                                                                                                                                                                                                    |
| const             | ✔       | null<br>booleans<br>numbers<br>strings                                                                                                                                                                                                                                                                                                         |
| enum              | ✔       | null<br>booleans<br>numbers<br>strings                                                                                                                                                                                                                                                                                                         |
| type              | ✔       | "null"<br>"boolean"<br>"integer"<br>"number"<br>"string"<br>"array"<br>"object"<br><br>Or an array of the above                                                                                                                                                                                                                                |
| number properties | ✘       | multipleOf<br>minimum<br>maximum<br>exclusiveMinimum<br>exclusiveMaximum<br><br>No typescript support for `multipleOf`<br>[Open question on GitHub about number ranges](https://github.com/Microsoft/TypeScript/issues/15480)                                                                                                                  |
| string properties | ✘       | minLength<br>maxLength<br>pattern<br>format<br><br>[Typescript support for string patterns and formats in v4.1](https://stackoverflow.com/questions/51445767/how-to-define-a-regex-matched-string-type-in-typescript)<br>Typescript's implementation produces a union of every possible combination so is not suitable for patterns or formats |
| array properties  | ✔       | items<br>uniqueItems<br>additionalItems<br><br>`T[]` - Array if `items` is a schema and `uniqueItems=false`<br>`Map<K, V>` - Map if `items` is a schema, `uniqueItems=true`, `additionalItems=false` and `items` has no other properties<br>`Set<T>` - Set if `items` is a schema, `uniqueItems=true` and is not a Map<br>`[T, U, V]` - Tuple if `items` is an array                                                                                                                      |
| array properties  | ✘       | contains<br>minItems<br>maxItems<br><br>array (and possibly tuple) min length: `type MinLengthArray<T> = [T, T, ...T[]];` Although no typescript support for a `Set<T>` of specific size<br>No typescript support for contains                                                                                                                 |
| object properties | ✔       | properties<br>additionalProperties                                                                                                                                                                                                                                                                                                             |
| combinations      | ✔       | allOf<br>anyOf<br>oneOf<br><br>If oneOf is used, OneOf_n types are dynamically generated in files that need them, for arrays with many items these types can get large and will be updated if typescript adds native support                                                                                                                   |

## Approach

The approach this package takes is to only do one thing but do it well, ie. transforming schema files to typescript files. It doesn't download any schemas, or do any validation, consistency checking, linting, prettifying etc. It assumes the schema author knows exactly what they want and it will generate typescript files that represent the schemas given as closely as possible, even if the generated types don't make sense or cannot be satisfied.

An example will make this clear:

Given the following schema in a file called `A.json`

```ts
{
  "type": "number",
  "$ref": "#/definitions/BOOL",
  "enum": [
    null,
    "tuv",
    "xyz"
  ],
  "definitions": {
    "BOOL": {
      "type": "boolean"
    }
  }
}
```

Invoking the generator will generate a file `A.ts` containing:

```ts
export type A = BOOL & (null | "tuv" | "xyz") & number;

export type BOOL = boolean;
```

Clearly type `A` cannot ever be satisfied, but it does match what the schema specified
