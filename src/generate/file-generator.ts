import * as path from 'path';
import { FileLocation } from '../files';
import { Schema } from '../schema';
import { filtered, filteredJoin } from '../util';
import { OneOfNGenerator } from './OneOfN-generator';
import { References } from './References';
import { nameGenerator } from './name-generator';
import { typeGenerator } from './type-generator';
import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo } from './TypeGenerator';

export const fileGenerator = (locatedSchema: LocatedSchema, inputInfo: SchemaInputInfo): string => {
  const references: References = {
    schema: new Map()
  };
  const gatheredInfo: SchemaGatheredInfo = {
    namedSchemas: new Map(),
    references,
    oneOfTypes: new Set()
  };
  const schemaContent = schemaContentGenerator(locatedSchema, gatheredInfo, inputInfo);
  const definitions = schemaMapGenerator(
    locatedSchema.fileLocation,
    locatedSchema.schema.definitions,
    gatheredInfo,
    inputInfo
  );
  const named = namedGenerator(locatedSchema.fileLocation, gatheredInfo, inputInfo);
  const imports = importsGenerator(locatedSchema.fileLocation, references);
  const oneOfs = oneOfTypesGenerator(gatheredInfo.oneOfTypes);
  return filteredJoin([imports, schemaContent, named, definitions, oneOfs], '\n\n') + '\n';
};

const schemaContentGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo, schemaName?: string): string | undefined => {
  const typeName = nameGenerator(schemaName || locatedSchema.fileLocation.fileName);
  const typeContent = typeGenerator(locatedSchema, gatheredInfo, inputInfo);
  return typeContent
    ? `export type ${typeName} = ${typeContent};`
    : undefined;
};

const importsGenerator = (fileLocation: FileLocation, references: References): string | undefined => {
  if (references.schema.size === 0) {
    return;
  }
  const content: (string | undefined)[] = [];
  content.push(importMapGenerator(fileLocation, references.schema));
  const defined = filtered(content);
  return defined.join('\n');
};

const importMapGenerator = (fileLocation: FileLocation, references: Map<FileLocation, Set<string>>): string | undefined => {
  if (references.size === 0) {
    return;
  }
  const imports: string[] = [];
  references.forEach((names, referenceFileLocation) => {
    if (names.size > 0) {
      const combinedNames = Array.from(names).sort().join(', ');
      const importPath = tsPathGenerator(
        path.normalize(path.relative(fileLocation.dir, referenceFileLocation.dir))
      );
      const file = referenceFileLocation.fileName.length === 0 ? '' : `/${referenceFileLocation.fileName}`;
      imports.push(`import { ${combinedNames} } from '${importPath}${file}';`);
    }
  });
  return imports.join('\n');
};

const namedGenerator = (fileLocation: FileLocation, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  if (gatheredInfo.namedSchemas.size === 0) {
    return;
  }
  const content: string[] = [];

  /* eslint-disable no-constant-condition */
  while (true) {
    const map: Map<string, Schema> = gatheredInfo.namedSchemas;
    gatheredInfo = {
      ...gatheredInfo,
      namedSchemas: new Map()
    };
    const schemaMapContent = schemaMapGenerator(fileLocation, map, gatheredInfo, inputInfo);
    if (schemaMapContent) {
      content.push(schemaMapContent);
    } else {
      return content.length === 0
        ? undefined
        : content.join('\n');
    }
  }
};

const oneOfTypesGenerator = (typeCounts: Set<number>): string | undefined => {
  if (typeCounts.size === 0) {
    return;
  }
  const oneOfTypeLines: string[] = [];
  typeCounts.forEach((typeCount: number) => {
    const oneOfType = OneOfNGenerator(typeCount);
    if (oneOfType) {
      oneOfTypeLines.push(oneOfType);
    }
  });
  return oneOfTypeLines.join('\n');
};

const schemaMapGenerator = (fileLocation: FileLocation, map: Map<string, Schema> | undefined, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  if (!map || map.size === 0) {
    return;
  }
  const content: string[] = [];
  map.forEach((namedSchema, name) => {
    const namedLocatedSchema: LocatedSchema = {
      fileLocation,
      schema: namedSchema
    };
    const schemaContent = schemaContentGenerator(namedLocatedSchema, gatheredInfo, inputInfo, name);
    if (schemaContent) {
      content.push(schemaContent);
    }
  });
  return content.join('\n');
};

const tsPathGenerator = (relativePath: string): string =>
  relativePath.startsWith('.')
    ? relativePath
    : '.' + path.sep + relativePath;
