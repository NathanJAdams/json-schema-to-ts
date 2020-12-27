import { Options } from '../../Options';
import { ComplexTS, TS } from '../../ts';
import { generator } from '..';

const combineElements = (...elements: string[]): string => {
  return elements.filter((_) => (_)).join('\n');
};

const generateDefinitions = (ts: ComplexTS, options: Options, references: Set<string>): string => {
  if (ts.definitions === undefined) {
    return '';
  }
  const definitionContents: string[] = [];
  ts.definitions.forEach((definition: TS, definitionId: string) => {
    const generatedDefinition: string = generator(definition.tsType).definition(definition, options, definitionId, references);
    definitionContents.push(generatedDefinition);
  });
  return definitionContents.join('\n');
};

const generateImports = (references: Set<string>): string => {
  if (references.size === 0) {
    return '';
  }
  return '';
  // TODO
};

export {
  combineElements,
  generator,
  generateDefinitions,
  generateImports
};
