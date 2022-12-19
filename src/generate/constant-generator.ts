import { LocatedSchema, TypeGenerator } from './TypeGenerator';

export const constantGenerator: TypeGenerator = (locatedSchema: LocatedSchema): string | undefined => {
  const constant = locatedSchema.schema.const;
  if (constant === undefined) {
    return undefined;
  }
  return (typeof constant === 'string')
    ? `'${constant}'`
    : `${constant}`;
};
