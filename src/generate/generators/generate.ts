import { ComplexTS, TS } from '../../ts';
import { generator } from '..';

const combineNewline = (...elements: string[]): string => {
  return combine('\n', ...elements);
};

const combine = (joiner: string, ...elements: string[]): string => {
  return elements.filter((_) => (_)).join(joiner);
};

const generateDefinitions = (ts: ComplexTS, references: Set<string>): string => {
  if (ts.definitions === undefined) {
    return '';
  }
  const definitionContents: string[] = [];
  ts.definitions.forEach((definition: TS, definitionId: string) => {
    const generatedDefinition: string = generator(definition.tsType).definition(definition, definitionId, references);
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
  combine,
  combineNewline,
  generator,
  generateDefinitions,
  generateImports
};
