const lineRegex = /^((?:\w|\d)+)\(((?:.*?)(?:,(?:.*?))?)\)/

export const parseScript = (script: string) => {
    const lines = script.split(';');

    let currentLine = 0;

    const statements = lines.map((x, i) => {
        const line = x.trim();

        if (!line) return undefined;

        const match = line.match(lineRegex);

        if (!match) throw new Error(`script failed at line ${i + 1}`);

        return [match[0], match[1].split(',').map(x => x.trim())];
    })
        .filter(x => x);

    return {
        getCurrentLine: () => statements[currentLine],
        nextLine: () => { currentLine++ },
    };
}