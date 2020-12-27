import { TS } from '.';

interface ComplexTS extends TS {
  definitions?: Map<string, TS>;
}

export {
  ComplexTS
};
