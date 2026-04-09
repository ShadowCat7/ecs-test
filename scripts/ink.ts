import fs from 'node:fs/promises';
import { Compiler } from 'inkjs/compiler/Compiler';

const INK_DIR = './src/inks/';
const JSON_DIR = './src/data/inks/';
const ENCODING = { encoding: 'utf8' } as const;

const go = async () => {
    try {
        await fs.rm(JSON_DIR, { recursive: true });
    } catch { }
    await fs.mkdir(JSON_DIR);

    const inkDir = await fs.readdir(INK_DIR, ENCODING);
    const promises = [];
    for (const file of inkDir) {
        promises.push(convert(file));
    }
    await Promise.all(promises);

    const watcher = fs.watch(INK_DIR, ENCODING);
    for await (const event of watcher) {
        const { eventType, filename } = event;
        if (!filename?.length) continue;
        console.log(`${eventType} from ${filename}`);
        const fileExists = await exists(filename);
        if (eventType === 'rename' && !fileExists) {
            console.log('deleting');
            deleteCompiled(filename);
        } else {
            console.log('building');
            convert(filename);
        }
    }
};

const deleteCompiled = async (filename: string) => {
    const newFilename = filename.split('.')[0] + '.json';
    const compiledFilename = `${JSON_DIR}${newFilename}`;
    console.log(`deleting ${compiledFilename}`);
    await fs.rm(compiledFilename);
};

const exists = async (filename: string) => {
    const fullFilename = `${INK_DIR}${filename}`;
    try {
        await fs.access(fullFilename);
        return true;
    } catch {
        return false;
    }
};

const convert = async (filename: string) => {
    const fullFilename = `${INK_DIR}${filename}`;
    const contents = await fs.readFile(fullFilename, ENCODING);
    const json = compile(contents);
    if (!json) return;
    const newFilename = filename.split('.')[0] + '.json';
    await fs.writeFile(`${JSON_DIR}${newFilename}`, json, { ...ENCODING });
};

const compile = (filename: string): string | void => {
    const compiler = new Compiler(filename);
    try {
        return compiler.Compile().ToJson();
    } catch (e) {
        console.error(e);
        return;
    }
};

go();