import fs from 'node:fs';

export default (path: string, options: Parameters<typeof fs.readFileSync>[1]): string => {
    const contents = fs.readFileSync(path, options);
    return contents;
};
