const filtered = (values: (string | undefined)[]): string[] => values.filter((_) => (_)) as string[];

const filteredJoin = (values: (string | undefined)[], joiner?: string): string => values.filter((_) => (_)).join(joiner ? joiner : '');

export {
  filtered,
  filteredJoin
};
