import { SchemaPrimitive } from '../schema';
import { LocatedSchema, TypeGenerator } from './TypeGenerator';

export const enumGenerator: TypeGenerator = (locatedSchema: LocatedSchema): string | undefined => {
  const _enum = locatedSchema.schema.enum;
  if (!_enum || _enum.size === 0) {
    return;
  }
  const enumTypes: string[] = [];
  _enum.forEach((primitive: SchemaPrimitive) => {
    const value = (typeof primitive === 'string')
      ? `'${primitive}'`
      : `${primitive}`;
    enumTypes.push(value);
  });
  const combined = enumTypes.join(' | ');
  return (_enum.size === 1)
    ? combined
    : `(${combined})`;
};
