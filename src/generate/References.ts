import { FileLocation } from '../files';

export type References = {
  schema: Map<FileLocation, Set<string>>;
}
