import { FileLocation } from '../files';

interface References {
  schema: Map<FileLocation, Set<string>>;
}

export {
  References
};
