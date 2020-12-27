import { Schema } from '../..';
import { SchemaConverter } from '..';
import { EnumTS } from '../../ts/EnumTS';
import { EnumOptions, Options } from '../../Options';
import { TSType } from '../../ts';

const BAD_NAME_CHAR_REGEX = /[^a-zA-Z0-9_]/gi;
const GOOD_INITIAL_CHAR_REGEX = /^[a-zA-Z_]/i;

interface EnumValues {
  nulls: Map<string, null>;
  booleans: Map<string, boolean>;
  numbers: Map<string, number>;
  strings: Map<string, string>;
}

const cleanKey = (value: string | number | boolean | null, enumOptions: EnumOptions): string => {
  const type: string = typeof value;
  const rawKey = String(value);
  const rawUpperCase = (enumOptions.booleanNullUpperCaseNames) && ((type === 'boolean' || type === 'object'))
    ? rawKey.toUpperCase()
    : rawKey;
  const cleanedCharsKey: string = rawUpperCase.replace(BAD_NAME_CHAR_REGEX, enumOptions.badNameCharReplacement);
  return cleanedCharsKey.match(GOOD_INITIAL_CHAR_REGEX)
    ? cleanedCharsKey
    : enumOptions.fixedPrefix + cleanedCharsKey;
};

const stringValue = (value: null | boolean, enumOptions: EnumOptions): string => String(enumOptions.booleanNullStringValues ? value : (value) ? 1 : 0);

const getEnumStringValues = (enumValues: EnumValues, enumOptions: EnumOptions): Map<string, string> => {
  const values: Map<string, string> = new Map();
  enumValues.nulls.forEach((value: null, key: string) => {
    values.set(key, stringValue(value, enumOptions));
  });
  enumValues.booleans.forEach((value: boolean, key: string) => {
    values.set(key, stringValue(value, enumOptions));
  });
  enumValues.numbers.forEach((value: number, key: string) => {
    values.set(key, String(value));
  });
  enumValues.strings.forEach((value: string, key: string) => {
    values.set(key, value);
  });
  return values;
};

const getEnumNumberValues = (enumValues: EnumValues): Map<string, number> => {
  const values: Map<string, number> = new Map();
  enumValues.nulls.forEach((_value: null, key: string) => {
    values.set(key, 0);
  });
  enumValues.booleans.forEach((value: boolean, key: string) => {
    values.set(key, value ? 1 : 0);
  });
  enumValues.numbers.forEach((value: number, key: string) => {
    values.set(key, value);
  });
  return values;
};

const enumConverter: SchemaConverter<EnumTS> = (schema: Schema, options: Options): EnumTS | undefined => {
  if (!options.ts.enums) {
    return undefined;
  }
  if (!schema.enum) {
    return undefined;
  }
  const enumOptions: EnumOptions = options.ts.enums;
  const enumValues: EnumValues = {
    strings: new Map(),
    numbers: new Map(),
    booleans: new Map(),
    nulls: new Map()
  };
  schema.enum.forEach((value: string | number | boolean | null) => {
    const key: string = cleanKey(value, enumOptions);
    switch (typeof value) {
      case 'string':
        enumValues.strings.set(key, value);
        break;
      case 'number':
        enumValues.numbers.set(key, value);
        break;
      case 'boolean':
        enumValues.booleans.set(key, value);
        break;
      case 'object':
        enumValues.nulls.set(key, value);
        break;
      default:
        throw Error(`Cannot convert element: ${value}`);
    }
  });
  const hasBooleanNulls = (enumValues.booleans.size > 0) || (enumValues.nulls.size > 0);
  const values: Map<string, string> | Map<string, number> = (enumValues.strings.size > 0) || (enumOptions.booleanNullStringValues && hasBooleanNulls)
    ? getEnumStringValues(enumValues, enumOptions)
    : getEnumNumberValues(enumValues);
  return {
    tsType: TSType.ENUM,
    id: schema.$id,
    values
  };
};

export {
  enumConverter
};
