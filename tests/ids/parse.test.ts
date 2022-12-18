import { parseSchemaId, parseSchemaRef } from '../../src/ids';

const compareId = (id: string, authority?: string, folder = '.', name?: string): void => {
  expect(parseSchemaId(id)).toEqual({ authority, folder, name });
};

const compareRef = (ref: string, authority?: string, folder = '.', name?: string, fragment?: string): void => {
  expect(parseSchemaRef(ref)).toEqual({ authority, folder, name, fragment });
};

describe('parse', () => {
  describe('generated schema ids', () => {
    const authority = 'https://abc.com';
    test('absolute', () => {
      compareId(`${authority}/a/b/c#`, authority, 'a/b', 'c');
      compareId(`${authority}/a/b/c`, authority, 'a/b', 'c');
      compareId(`${authority}/a/b`, authority, 'a', 'b');
      compareId(`${authority}/a`, authority, '.', 'a');
    });
    test('relative', () => {
      compareId('/a/b/c#', undefined, 'a/b', 'c');
      compareId('/a/b/c', undefined, 'a/b', 'c');
      compareId('/a/b', undefined, 'a', 'b');
      compareId('/a', undefined, '.', 'a');
    });
    test('undefined', () => {
      expect(parseSchemaId('/')).toBeUndefined();
      expect(parseSchemaId('')).toBeUndefined();
    });
  });
  describe('generated schema refs', () => {
    test('absolute', () => {
      const authority = 'https://abc.com';
      compareRef(`${authority}/a/b#$defs/c`, authority, 'a', 'b', 'c');
      compareRef(`${authority}/a/b#definitions/c`, authority, 'a', 'b', 'c');
      compareRef(`${authority}/a#$defs/c`, authority, '.', 'a', 'c');
      compareRef(`${authority}/a#definitions/c`, authority, '.', 'a', 'c');
      compareRef(`${authority}/a/b#c`, authority, 'a', 'b', 'c');
      compareRef(`${authority}/a#b`, authority, '.', 'a', 'b');
      compareRef(`${authority}/a/b/c`, authority, 'a/b', 'c');
      compareRef(`${authority}/a/b`, authority, 'a', 'b');
      compareRef(`${authority}/a`, authority, '.', 'a');
    });
    test('relative', () => {
      compareRef('/a/b#$defs/c', undefined, 'a', 'b', 'c');
      compareRef('/a/b#definitions/c', undefined, 'a', 'b', 'c');
      compareRef('/a#$defs/c', undefined, '.', 'a', 'c');
      compareRef('/a#definitions/c', undefined, '.', 'a', 'c');
      compareRef('/a/b#c', undefined, 'a', 'b', 'c');
      compareRef('/a#b', undefined, '.', 'a', 'b');
      compareRef('/a/b/c', undefined, 'a/b', 'c');
      compareRef('/a/b', undefined, 'a', 'b');
      compareRef('/a', undefined, '.', 'a');
    });
    test('local', () => {
      expect(parseSchemaRef('#/$defs/a')).toEqual({ fragment: 'a' });
      expect(parseSchemaRef('#/definitions/a')).toEqual({ fragment: 'a' });
      expect(parseSchemaRef('#/a')).toEqual({ fragment: 'a' });
      expect(parseSchemaRef('#$defs/a')).toEqual({ fragment: 'a' });
      expect(parseSchemaRef('#definitions/a')).toEqual({ fragment: 'a' });
      expect(parseSchemaRef('#a')).toEqual({ fragment: 'a' });
    });
    test('undefined', () => {
      expect(parseSchemaRef('/#')).toBeUndefined();
      expect(parseSchemaRef('/')).toBeUndefined();
      expect(parseSchemaRef('#')).toBeUndefined();
      expect(parseSchemaRef('')).toBeUndefined();
    });
  });
});
