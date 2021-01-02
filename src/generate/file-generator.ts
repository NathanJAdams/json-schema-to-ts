import * as path from 'path';
import { FileLocation } from '../files';
import { Schema } from '../schema';
import { filtered, filteredJoin } from '../util';
import { ONE_OF, References } from './References';
import { typeGenerator } from './type-generator';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo } from './TypeGenerator';
import { PACKAGE_NAME } from './util';

const fileGenerator = (locatedSchema: LocatedSchema, inputInfo: SchemaInputInfo): string => {
  const namedSchemas: Map<string, Schema> = new Map();
  const references: References = {
    package: new Map(),
    schema: new Map()
  };
  references.package.set(ONE_OF, new Set());
  const gatheredInfo: SchemaGatheredInfo = {
    namedSchemas,
    references
  };
  const schemaContent: string | undefined = schemaContentGenerator(locatedSchema, gatheredInfo, inputInfo);
  const definitions: string | undefined = mapGenerator(locatedSchema.fileLocation, locatedSchema.schema.definitions, gatheredInfo, inputInfo);
  const named: string | undefined = namedGenerator(locatedSchema.fileLocation, gatheredInfo, inputInfo);
  const imports: string | undefined = importsGenerator(locatedSchema.fileLocation, references);
  return filteredJoin([imports, schemaContent, named, definitions], '\n\n') + '\n';
};

const schemaContentGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo, schemaName?: string): string | undefined => {
  const typeName: string = typeNameGenerator(schemaName || locatedSchema.fileLocation.fileName);
  const typeContent: string | undefined = typeGenerator(locatedSchema, gatheredInfo, inputInfo);
  return (typeContent)
    ? `export type ${typeName} = ${typeContent};`
    : undefined;
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
      const file: string = (referenceFileLocation.fileName.length === 0)
        ? ''
        : `/${referenceFileLocation.fileName}`;
      imports.push(`import { ${combinedNames} } from '${importPath}${file}';`);
    }
  });
  return imports.join('\n');
};

const namedGenerator = (fileLocation: FileLocation, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  if (gatheredInfo.namedSchemas.size === 0) {
    return undefined;
  }
  const references: References = gatheredInfo.references;
  const content: string[] = [];

  /* eslint-disable no-constant-condition */
  while (true) {
    const map: Map<string, Schema> = gatheredInfo.namedSchemas;
    gatheredInfo = {
      namedSchemas: new Map(),
      references
    };
    const mapContent: string | undefined = mapGenerator(fileLocation, map, gatheredInfo, inputInfo);
    if (mapContent) {
      content.push(mapContent);
    } else {
      return (content.length === 0)
        ? undefined
        : content.join('\n');
    }
  }
};

const mapGenerator = (fileLocation: FileLocation, map: Map<string, Schema> | undefined, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  if (!map || map.size === 0) {
    return undefined;
  }
  const content: string[] = [];
  map.forEach((namedSchema: Schema, name: string) => {
    const namedLocatedSchema: LocatedSchema = {
      fileLocation,
      schema: namedSchema
    };
    const schemaContent: string | undefined = schemaContentGenerator(namedLocatedSchema, gatheredInfo, inputInfo, name);
    if (schemaContent) {
      content.push(schemaContent);
    }
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
