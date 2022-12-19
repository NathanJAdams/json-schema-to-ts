import * as fs from 'fs/promises';
import * as path from 'path';

const READ_OPTIONS: { withFileTypes: true } = { withFileTypes: true };

type FilesGenerator = AsyncGenerator<string, void | FilesGenerator, void>;

export const files = async function* (dir: string, recursive: boolean): FilesGenerator {
  const dirents = await fs.readdir(dir, READ_OPTIONS);
  for (const dirent of dirents) {
    const filePath = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (recursive) {
        yield* files(filePath, recursive);
      }
    } else {
      yield filePath;
    }
  }
};
