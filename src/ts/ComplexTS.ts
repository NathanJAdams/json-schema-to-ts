import { TS } from '.';

interface ComplexTS extends TS {
  definitions?: Map<string, TS>;
  intersectionTypesAllOf?: TS[];
  unionTypesAnyOf?: TS[];
  unionTypesOneOf?: TS[];
}

export {
  ComplexTS
};
