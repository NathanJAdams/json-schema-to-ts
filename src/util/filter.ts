const filtered = (values: (string | undefined)[]): string[] => {
  const f:string[]= values.filter((_) => (_)) as string[];
  console.log('filtered values:'+f);
  return f;
};

const filteredJoin = (values: (string | undefined)[], joiner?: string): string => values.filter((_) => (_)).join(joiner ? joiner : '');

export {
  filtered,
  filteredJoin
};
