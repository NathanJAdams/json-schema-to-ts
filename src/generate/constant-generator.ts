import { LocatedSchema, TypeGenerator } from './TypeGenerator';

const constantGenerator: TypeGenerator = (locatedSchema: LocatedSchema): string | undefined => {
  const constant: null | boolean | number | string | undefined = locatedSchema.schema.const;
  if (constant === undefined) {
    return undefined;
  }
  return (typeof constant === 'string')
    ? `'${constant}'`
    : `${constant}`;
};

export {
  constantGenerator
};
