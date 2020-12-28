import { Schema, SchemaPrimitive } from '../schema';
import { TypeGenerator } from './TypeGenerator';

const enumGenerator: TypeGenerator = (schema: Schema): string | undefined => {
  if (!schema.enum || schema.enum.size === 0) {
    return undefined;
  }
  const enumTypes: string[] = [];
  schema.enum.forEach((primitive: SchemaPrimitive) => {
    const value: string = (typeof primitive === 'string')
      ? `'${primitive}'`
      : `${primitive}`;
    enumTypes.push(value);
  });
  const combined = enumTypes.join(' | ');
  return (schema.enum.size === 1)
    ? combined
    : `(${combined})`;
};

export {
  enumGenerator
};
