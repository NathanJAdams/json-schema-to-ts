export const isDefined: <T>(_: T) => boolean = (_) => _ !== undefined;

export const filtered = (values: (string | undefined)[]): string[] => values.filter(isDefined) as string[];

export const filteredJoin = (values: (string | undefined)[], joiner?: string): string => values.filter(isDefined).join(joiner ? joiner : '');
