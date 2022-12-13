import { nameGenerator } from '../../src/generate/name-generator';

describe('nameGenerator', () => {
  test('can replace unusable characters', () => {
    expect(nameGenerator('abc!"£$%^&*()-+=~#{}[]:;@\'<>,.?/|\\')).toBe('abc');
  });
  test('can prefix name if starts with numbers', () => {
    expect(nameGenerator('123abc')).toBe('_123abc');
  });
});
