import { FileLocation } from '../files';
import { PACKAGE_NAME } from './util';

const ONE_OF: FileLocation = {
  dir: PACKAGE_NAME,
  fileName: ''
};

interface References {
  package: Map<FileLocation, Set<string>>;
  schema: Map<FileLocation, Set<string>>;
}

export {
  ONE_OF,
  References
};
