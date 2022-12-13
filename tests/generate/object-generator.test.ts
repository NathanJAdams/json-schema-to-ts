import { OptionalFieldPattern, UntypedType } from '../../src';
import { FileLocation } from '../../src/files';
import { objectGenerator } from '../../src/generate/object-generator';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo } from '../../src/generate/TypeGenerator';
import { Schema } from '../../src/schema';

describe('objectGenerator', () => {
  const boolSchema: Schema = {
    type: new Set(['boolean'])
  };
  const schema: Schema = {
    type: new Set(['object']),
    properties: new Map([ ['abc def', boolSchema] ]),
    required: new Set(['abc def']),
    additionalProperties: false
  };
  const fileLocation: FileLocation = {
    dir: '',
    fileName: ''
  };
  const locatedSchema: LocatedSchema = {
    fileLocation,
    schema
  };
  const gatheredInfo: SchemaGatheredInfo = {
    namedSchemas: new Map([ ['abc', schema], ['abc def', boolSchema] ]),
    oneOfTypes: new Set([123]),
    references: {
      schema: new Map([])
    }
  };
  const inputInfo: SchemaInputInfo = {
    idFileLocations: new Map([ ['abc', fileLocation] ]),
    options: {
      files: {
        destination: {
          dir: '',
          indexFiles: true,
          preClean: false
        },
        source: {
          dir: '',
          encoding: 'ascii',
          recursive: true
        }
      },
      ts: {
        optionalFields: OptionalFieldPattern.PIPE_UNDEFINED,
        untyped: UntypedType.UNKNOWN
      }
    }
  };
  test('can replace unusable characters for property names', () => {
    expect(objectGenerator(locatedSchema, gatheredInfo, inputInfo)).toBe('{\nabcdef: boolean;\n}');
  });
});
