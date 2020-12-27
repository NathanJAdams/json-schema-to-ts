import { Schema } from '..';
import { TS } from '../ts';

interface SchemaConverter<T extends TS> {
  (schema: Schema): T | undefined;
}

export {
  SchemaConverter
};
