const nameGenerator = (name: string): string => {
  const usableName: string = name.replace(/[^a-zA-Z0-9_]/g, '');
  return usableName.match(/^[a-zA-Z_]/)
    ? usableName
    : '_' + usableName;
};

export {
  nameGenerator
}
