import { LocatedSchema, SchemaGatheredInfo, SchemaInputInfo, TypeGenerator, located } from './TypeGenerator';
import { typeGenerator } from './type-generator';
import { Schema, SchemaCollection } from '../schema';
import { filteredJoin } from '../util';

export const collectionGenerator: TypeGenerator = (locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const schema = locatedSchema.schema;
  if (!schema.type || !schema.type.has('array') || !schema.collection) {
    return undefined;
  }
  const collection = schema.collection;
  const collectionItems = collection.items;
  if (Array.isArray(collectionItems)) {
    return tupleGenerator(collectionItems, collection.additionalItems, locatedSchema, gatheredInfo, inputInfo);
  } else {
    if (collection.uniqueItems) {
      const collectionProperties = collectionItems.object?.properties;
      const key = collectionProperties?.get('key');
      const value = collectionProperties?.get('value');
      if (isMap(collection) && key && value) {
        return mapGenerator(key, value, locatedSchema, gatheredInfo, inputInfo);
      } else {
        return setGenerator(collectionItems, locatedSchema, gatheredInfo, inputInfo);
      }
    } else {
      return arrayGenerator(collectionItems, locatedSchema, gatheredInfo, inputInfo);
    }
  }
};

const isMap = (collection: SchemaCollection): boolean => {
  if (!collection.uniqueItems || Array.isArray(collection.items) || collection.additionalItems) {
    return false;
  }
  const element = collection.items;
  if (!element.object || element.const || element.$ref || element.enum || element.collection || element.allOf || element.anyOf || element.oneOf) {
    return false;
  }
  const object = element.object;
  return (object.properties.size === 2)
    && (object.properties.has('key'))
    && (object.properties.has('value'))
    && (object.additionalProperties === undefined)
    && (object.required.size === 2)
    && (object.required.has('key'))
    && (object.required.has('value'));
};

const arrayGenerator = (items: Schema, locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const itemsLocatedSchema = located(items, locatedSchema);
  const itemsType = typeGenerator(itemsLocatedSchema, gatheredInfo, inputInfo);
  return `${itemsType}[]`;
};

const setGenerator = (items: Schema, locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const itemsLocatedSchema = located(items, locatedSchema);
  const itemsType = typeGenerator(itemsLocatedSchema, gatheredInfo, inputInfo);
  return `Set<${itemsType}>`;
};

const mapGenerator = (key: Schema, value: Schema, locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const keyLocatedSchema = located(key, locatedSchema);
  const valueLocatedSchema = located(value, locatedSchema);
  const keyType = typeGenerator(keyLocatedSchema, gatheredInfo, inputInfo);
  const valueType = typeGenerator(valueLocatedSchema, gatheredInfo, inputInfo);
  return `Map<${keyType}, ${valueType}>`;
};

const tupleGenerator = (items: Schema[], additionalItems: Schema | undefined, locatedSchema: LocatedSchema, gatheredInfo: SchemaGatheredInfo, inputInfo: SchemaInputInfo): string | undefined => {
  const itemTypes = items
    .map((item) => located(item, locatedSchema))
    .map((itemLocatedSchema) => typeGenerator(itemLocatedSchema, gatheredInfo, inputInfo));
  const additionalType = (additionalItems)
    ? typeGenerator(located(additionalItems, locatedSchema), gatheredInfo, inputInfo)
    : undefined;
  const itemsCsv = filteredJoin(itemTypes, ', ');
  const combinedItemsCsv = additionalType
    ? `${itemsCsv}, ...${additionalType}[]`
    : `${itemsCsv}`;
  return `[${combinedItemsCsv}]`;
};
