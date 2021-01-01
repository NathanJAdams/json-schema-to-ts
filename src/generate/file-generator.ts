import * as path from 'path';
import { FileLocation } from '../files';
import { AllOptions } from '../options';
import { RootSchema, Schema } from '../schema';
import { filtered, filteredJoin } from '../util';
import { ONE_OF, References } from './References';
import { typeGenerator } from './type-generator';
import { PACKAGE_NAME } from './util';

const fileGenerator = (fileLocation: FileLocation, rootSchema: RootSchema, options: AllOptions, idFileLocations: Map<string, FileLocation>): string => {
  const references: References = {
    package: new Map(),
    schema: new Map()
  };
  references.package.set(ONE_OF, new Set());
  const namedSchemas: Map<string, Schema> = new Map();
  const schemaContent: string = rootSchemaGenerator(fileLocation.fileName, rootSchema, namedSchemas, references, options, idFileLocations);
  const definitions: string | undefined = definitionsGenerator(rootSchema.definitions, namedSchemas, references, options, idFileLocations);
  const named: string | undefined = namedGenerator(namedSchemas, references, options, idFileLocations);
  const imports: string | undefined = importsGenerator(fileLocation, references);
  return filteredJoin([imports, schemaContent, named, definitions], '\n\n') + '\n';
};

const rootSchemaGenerator = (fileName: string, schema: Schema, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string => {
  const typeName: string = typeNameGenerator(fileName);
  return schemaGenerator(typeName, schema, namedSchemas, references, options, idFileLocations);
};

const schemaGenerator = (typeName: string, schema: Schema, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string => {
  const typeContent: string = typeGenerator(schema, namedSchemas, references, options, idFileLocations);
  return `export type ${typeName} = ${typeContent};`;
};

const importsGenerator = (fileLocation: FileLocation, references: References): string | undefined => {
  if (references.package.size === 0 && references.schema.size === 0) {
    return undefined;
  }
  const content: (string | undefined)[] = [];
  content.push(importMapGenerator(fileLocation, references.package));
  content.push(importMapGenerator(fileLocation, references.schema));
  const defined: string[] = filtered(content);
  return defined.join('\n');
};

const importMapGenerator = (fileLocation: FileLocation, references: Map<FileLocation, Set<string>>): string | undefined => {
  if (references.size === 0) {
    return undefined;
  }
  const imports: string[] = [];
  references.forEach((names: Set<string>, referenceFileLocation: FileLocation) => {
    if (names.size > 0) {
      const combinedNames: string = Array.from(names).sort().join(', ');
      const dir: string = referenceFileLocation.dir;
      const importPath: string = (dir === PACKAGE_NAME)
        ? dir :
        tsPathGenerator(path.normalize(path.relative(fileLocation.dir, dir)));
      const file: string = (fileLocation.fileName.length === 0)
        ? ''
        : `/${referenceFileLocation.fileName}`;
      imports.push(`import { ${combinedNames} } from '${importPath}${file}';`);
    }
  });
  return imports.join('\n');
};

const namedGenerator = (namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string | undefined => {
  if (namedSchemas.size === 0) {
    return undefined;
  }
  const content: (string | undefined)[] = [];
  const subNamedSchemas: Map<string, Schema> = new Map();
  namedSchemas.forEach((schema: Schema, name: string) => {
    const typeName: string = typeNameGenerator(name);
    const schemaContent: string = schemaGenerator(typeName, schema, subNamedSchemas, references, options, idFileLocations);
    content.push(schemaContent);
  });
  const subContent = namedGenerator(subNamedSchemas, references, options, idFileLocations);
  content.push(subContent);
  return filteredJoin(content, '\n');
};

const definitionsGenerator = (definitions: Map<string, Schema> | undefined, namedSchemas: Map<string, Schema>, references: References, options: AllOptions, idFileLocations: Map<string, FileLocation>): string | undefined => {
  if (!definitions || definitions.size === 0) {
    return undefined;
  }
  const content: string[] = [];
  definitions.forEach((schema: Schema, name: string) => {
    const typeName: string = typeNameGenerator(name);
    const schemaContent: string = schemaGenerator(typeName, schema, namedSchemas, references, options, idFileLocations);
    content.push(schemaContent);
  });
  return content.join('\n');
};

const typeNameGenerator = (fileName: string): string => {
  const usableChars: string = fileName.replace(/[^a-zA-Z0-9_]/g, '');
  return ((usableChars.length > 0) && usableChars.match(/^[a-zA-Z_]/))
    ? usableChars
    : '_' + usableChars;
};

const tsPathGenerator = (relativePath: string): string => relativePath.startsWith('.') ? relativePath : '.' + path.sep + relativePath;

export {
  fileGenerator
};
