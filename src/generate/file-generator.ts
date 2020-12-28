import * as path from 'path';
import { Options } from '../Options';
import { RootSchema, Schema, SchemaLocation } from '../schema';
import { filteredJoin } from '../util';
import { typeGenerator } from './type-generator';

const fileGenerator = (schemaLocation: SchemaLocation, rootSchema: RootSchema, options: Options): string => {
  const references: Set<string> = new Set();
  const namedSchemas: Map<string, Schema> = new Map();
  const schemaContent: string = rootSchemaGenerator(schemaLocation.file, rootSchema, namedSchemas, references, options);
  const definitions: string | undefined = definitionsGenerator(rootSchema.definitions, namedSchemas, references, options);
  const named: string | undefined = namedGenerator(namedSchemas, references, options);
  const imports: string | undefined = importsGenerator(schemaLocation, references);
  return filteredJoin([imports, schemaContent, named, definitions], '\n\n') + '\n';
};

const rootSchemaGenerator = (fileName: string, schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string => {
  const typeName: string = typeNameGenerator(fileName, schema.$id);
  return schemaGenerator(typeName, schema, namedSchemas, references, options);
};

const schemaGenerator = (typeName: string, schema: Schema, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string => {
  const typeContent: string = typeGenerator(schema, namedSchemas, references, options);
  return `export type ${typeName} = ${typeContent};`;
};

const importsGenerator = (_schemaLocation: SchemaLocation, references: Set<string>): string | undefined => {
  if (references.size === 0) {
    return undefined;
  }
  const paths: Map<string, string[]> = new Map();
  references.forEach((reference: string) => {
    const name = path.basename(reference);
    const dir = reference.substring(0, name.length);
    let names: string[] | undefined = paths.get(dir);
    if (!names) {
      names = [];
      paths.set(dir, names);
    }
    names.push(name);
  });
  const content: string[] = [];
  paths.forEach((names: string[], dir: string) => {
    const imported: string = names.join(', ');
    // TODO make imports relative to schemaLocation
    content.push(`import { ${imported} } from '${dir}';`);
  });
  return content.join('\n');
};

const namedGenerator = (namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (namedSchemas.size === 0) {
    return undefined;
  }
  const content: (string | undefined)[] = [];
  const subNamedSchemas: Map<string, Schema> = new Map();
  namedSchemas.forEach((schema: Schema, name: string) => {
    const typeName: string = typeNameGenerator(name, schema.$id);
    const schemaContent: string = schemaGenerator(typeName, schema, subNamedSchemas, references, options);
    content.push(schemaContent);
  });
  const subContent = namedGenerator(subNamedSchemas, references, options);
  content.push(subContent);
  return filteredJoin(content, '\n');
};

const definitionsGenerator = (definitions: Map<string, Schema> | undefined, namedSchemas: Map<string, Schema>, references: Set<string>, options: Options): string | undefined => {
  if (!definitions || definitions.size === 0) {
    return undefined;
  }
  const content: string[] = [];
  definitions.forEach((schema: Schema, name: string) => {
    const typeName: string = typeNameGenerator(name, schema.$id);
    const schemaContent: string = schemaGenerator(typeName, schema, namedSchemas, references, options);
    content.push(schemaContent);
  });
  return content.join('\n');
};

const typeNameGenerator = (name: string, id?: string): string => (id) ? id : name;

export {
  fileGenerator
};
