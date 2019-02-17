export const times = (times: number, txt: string, join = ''): string => {
    return [...Array(times).keys()].map(() => txt).join(join);
};

export const padArrayWith = (source: string[] | number[], length: number, replacement: string) => {
    return [...Array(length - source.length).fill(replacement), ...source];
};

export const padStringWith = (source: string | number, length: number, replacement: string, stringSource = String(source)) => {
    return [...Array(length - stringSource.length).fill(replacement), ...stringSource.split('')].join('');
};
