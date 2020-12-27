import { Schema } from '..';
import { Options } from '../Options';
import { TS } from '../ts';

interface SchemaConverter<T extends TS> {
  (schema: Schema, options: Options): T | undefined;
}

export {
  SchemaConverter
};
