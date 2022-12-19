const SuppressNGenerator = (suppressCount: number): string => {
  const suppressTypeArgs: string[] = [];
  for (let i = 0; i < suppressCount; i++) {
    suppressTypeArgs.push(`S${i}`);
  }
  const suppressType = `Suppress_${suppressCount}<T, ${suppressTypeArgs.join(', ')}>`;
  const excludeType = `Exclude<(keyof ${suppressTypeArgs.join(' | keyof ')}), keyof T>`;
  return `type ${suppressType} = T & { [P in ${excludeType}]?: never };`;
};

export const OneOfNGenerator = (typeCount: number): string | undefined => {
  if (!Number.isInteger(typeCount) || typeCount < 2) {
    return undefined;
  }
  const typeArgs: string[] = [];
  for (let i = 0; i < typeCount; i++) {
    typeArgs.push(`T${i}`);
  }
  const pipeSepTypes = typeArgs.join(' | ');
  const firstLine = `type OneOf_${typeCount}<${typeArgs.join(', ')}> = (${pipeSepTypes}) extends object`;
  const middleLines: string[] = [];
  const suppressCount = typeCount - 1;
  for (let i = 0; i < typeCount; i++) {
    const temp = typeArgs[i];
    typeArgs[i] = typeArgs[0];
    typeArgs[0] = temp;
    middleLines.push(`Suppress_${suppressCount}<${typeArgs.join(', ')}>`);
  }
  const middle = `? ${middleLines.join('\n| ')}`;
  const lastLine = `: ${pipeSepTypes};`;
  const suppressType = SuppressNGenerator(suppressCount);
  return [firstLine, middle, lastLine, suppressType].join('\n');
};
